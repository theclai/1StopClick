import { IUser } from 'app/core/user/user.model';
import { AccountService } from 'app/core';
import { ShoppingCartService } from 'app/entities/shopping-cart';
import { ProductOrderService } from './../../entities/product-order/product-order.service';
import { PaypalService } from './paypal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IInvoice, InvoiceStatus } from 'app/shared/model/invoice.model';
import { InvoiceService } from 'app/entities/invoice';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IProductOrder, Orderstatus } from 'app/shared/model/product-order.model';
import * as moment from 'moment';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { OwnedProductService } from 'app/entities/owned-product';
import { IOwnedProduct } from 'app/shared/model/owned-product.model';

@Component({
    selector: 'jhi-payment',
    templateUrl: './payment.component.html',
    styles: []
})
export class PaymentComponent implements OnInit, OnDestroy {
    invoiceId;
    string;
    invoiceSubscription: Subscription;
    invoice: IInvoice;
    productOrder: IProductOrder;
    productOrderSubscription: Subscription;
    initiatePaypalUrl: any;
    paymentId: any;
    payerId: any;
    routeSubscription: Subscription;
    afterPayment: any;
    afterSuccessPayment: boolean;
    orderItem: IOrderItem[];
    locationSubscription: Subscription;
    paypalSubs: Subscription;
    account: Account;
    user: IUser[];
    tempUser: any = {};
    ownedProduct: IOwnedProduct;
    ownedProductSubs: Subscription;

    constructor(
        private invoiceService: InvoiceService,
        private route: ActivatedRoute,
        private router: Router,
        private paypalService: PaypalService,
        private productOrderService: ProductOrderService,
        private shoppingCartService: ShoppingCartService,
        private accountService: AccountService,
        private ownedProductService: OwnedProductService
    ) {
        this.initiatePaypalUrl = {};
        this.afterPayment = {};
        this.afterSuccessPayment = false;
        this.invoice = {};
        this.ownedProduct = {};
        this.productOrder = {};
        this.orderItem = [];
        this.user = [];
    }
    async ngOnInit() {
        this.invoiceId = this.route.snapshot.paramMap.get('invoiceId');
        this.invoiceSubscription = this.invoiceService.find(this.invoiceId).subscribe(
            (res: HttpResponse<IInvoice>) => {
                this.generateInvoice(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.status)
        );
        this.routeSubscription = this.route.queryParams.subscribe(params => {
            this.paymentId = params.paymentId;
            this.payerId = params.PayerID;
            if (this.paymentId && this.payerId) {
                this.completePayment(this.paymentId, this.payerId);
            }
        });
        this.account = await this.accountService.identity().then((account: Account) => {
            this.setAccount(account);
            return (this.account = account);
        });
    }
    setAccount(account: any) {
        if (!(account === null)) {
            this.tempUser.login = account.login;
            this.tempUser.email = account.email;
            this.tempUser.id = account.id;
        }
    }
    onError(status: number): void {
        if (status === 404) {
            this.router.navigate(['404']);
        }
    }
    generateInvoice(body: IInvoice) {
        this.invoice = body;
        this.productOrder = this.invoice.productOrder;
        this.generateProductOrder(this.invoice.productOrder.id);
    }
    generateProductOrder(id: string) {
        this.productOrderSubscription = this.productOrderService.find(id).subscribe((res: HttpResponse<IProductOrder>) => {
            this.orderItem = res.body.orderItems;
        });
    }

    ngOnDestroy() {
        if (this.invoiceSubscription) {
            this.invoiceSubscription.unsubscribe();
        }
        if (this.ownedProductSubs) {
            this.ownedProductSubs.unsubscribe();
        }
        if (this.productOrderSubscription) {
            this.productOrderSubscription.unsubscribe();
        }
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.paypalSubs) {
            this.paypalSubs.unsubscribe();
        }
    }
    changePaymentMethod() {
        this.router.navigate(['checkout']);
    }

    makePayment(sum: number) {
        const sumUSD = (sum / 15000).toFixed(2);
        const currentOrigin = document.location.origin;
        const currentUrl = this.router.url;
        this.paypalSubs = this.paypalService.makePayment(sumUSD, currentOrigin, currentUrl).subscribe((res: any) => {
            this.initiatePaypalUrl = res;
            window.location.href = this.initiatePaypalUrl.redirect_url;
        });
    }
    async completePayment(paymentId: string, payerId: string) {
        await this.paypalService.completePayment(paymentId, payerId).subscribe((response: any) => {
            this.afterPayment = response;
            if (this.afterPayment.status === 'success') {
                this.updateInvoiceToComplete();
            }
        });
    }
    async updateInvoiceToComplete() {
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        this.user = [
            {
                id: this.tempUser.id,
                login: this.tempUser.login,
                email: this.tempUser.email
            }
        ];
        this.productOrder.placeDate = dateMoment;
        this.productOrder.status = Orderstatus.COMPLETED;
        this.productOrder.orderItems = this.orderItem;
        this.productOrder.users = this.user;
        this.invoice.status = InvoiceStatus.PAID;
        this.afterSuccessPayment = true;
        setTimeout(() => {
            this.createOwnedProduct();
            this.router.navigate(['checkout/purchase-confirmation', this.invoiceId]);
        }, 1000);
        const cartId = localStorage.getItem('cartId');
        await this.shoppingCartService.delete(cartId).subscribe(x => {
            localStorage.removeItem('cartId');
        });
        await this.invoiceService.update(this.invoice).subscribe();
        await this.productOrderService.update(this.productOrder).subscribe();
    }

    async cancelOrder() {
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        this.user = [
            {
                id: this.tempUser.id,
                login: this.tempUser.login,
                email: this.tempUser.email
            }
        ];
        this.invoice.status = InvoiceStatus.CANCELLED;
        this.productOrder.status = Orderstatus.CANCELLED;
        this.productOrder.placeDate = dateMoment;
        this.productOrder.users = this.user;
        await this.productOrderService.update(this.productOrder).subscribe();
        await this.invoiceService.update(this.invoice).subscribe(x => {
            setTimeout(() => {
                this.router.navigate(['']);
            }, 1000);
        });
    }

    myOrder() {
        this.router.navigate(['my-order']);
    }
    protected createOwnedProduct() {
        const userTemp: IUser = {
            id: this.tempUser.id,
            login: this.tempUser.name,
            email: this.tempUser.email
        };
        const productTemp = this.orderItem.map(x => x.product);
        this.ownedProductService.query({}).subscribe((res: HttpResponse<IOwnedProduct[]>) => {
            this.ownedProduct = res.body.find(x => x.user.id === userTemp.id);
            if (!(this.ownedProduct === undefined)) {
                for (let i = 0; i < productTemp.length; i++) {
                    this.ownedProduct.products.push(productTemp[i]);
                }
                this.ownedProductSubs = this.ownedProductService.update(this.ownedProduct).subscribe();
            } else {
                this.ownedProduct = {};
                this.ownedProduct.products = productTemp;
                this.ownedProduct.user = userTemp;
                this.ownedProductSubs = this.ownedProductService.create(this.ownedProduct).subscribe();
            }
        });
    }
}
