import { ProductOrderService } from 'app/entities/product-order';
import { IInvoice, Invoice } from './../../shared/model/invoice.model';
import { InvoiceStatus, PaymentMethod } from 'app/shared/model/invoice.model';
import { ProductOrder, Orderstatus, IProductOrder } from 'app/shared/model/product-order.model';
import { Route, Router } from '@angular/router';
import { ProductDiscountService } from 'app/entities/product-discount';
import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Subscription, using, Observable } from 'rxjs';
import { OrderItem, IOrderItem } from 'app/shared/model/order-item.model';
import { ShoppingCartService } from 'app/entities/shopping-cart';
import { HttpResponse } from '@angular/common/http';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { AccountService, IUser } from 'app/core';
import { IProductDiscount } from 'app/shared/model/product-discount.model';
import * as moment from 'moment';
import { InvoiceService } from 'app/entities/invoice';
import { OrderItemService } from 'app/entities/order-item';

@Component({
    selector: 'jhi-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['checkout.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    orderItem: OrderItem[];
    users: IUser[];
    invoices: Invoice;
    cartId: string;
    quantity: number;
    totalPrice: number;
    order: any = {};
    userId: string;
    isEmpty: boolean;
    account: Account;
    productOrder: ProductOrder;
    public options = [
        // { value: PaymentMethod.ONESTOPCLICK, id: 'onestopclick-icon', name: 'OneStop Pay' },
        { value: PaymentMethod.PAYPAL, id: 'paypal-icon', name: 'Paypal' },
        { value: PaymentMethod.FREE, id: 'visa-icon', name: 'Free (for test)' }
    ];
    voucherTemp: boolean;
    isVoucherChecked: boolean;
    productDiscount: IProductDiscount[];
    voucherNotFound: boolean;
    totalAfterDiscount: number;
    voucherNotifNotFound: boolean;
    productOrderSubscription: Subscription;
    voucherSubscription: Subscription;
    shoppingCartSubscription: Subscription;
    invoiceSubscription: Subscription;
    deleteSubscription: Subscription;
    invoiceStatus: InvoiceStatus;
    paymentType: any;
    invoiceId: string;
    isBelowMinOrder: boolean;
    minimumOrder: number;
    voucherApplied: boolean;

    constructor(
        private shoppingCartService: ShoppingCartService,
        private accountService: AccountService,
        private productDiscountService: ProductDiscountService,
        private productOrderService: ProductOrderService,
        private route: Router,
        private invoiceService: InvoiceService,
        private orderItemService: OrderItemService
    ) {
        this.orderItem = [];
        this.users = [];
        this.invoices = {};
        this.productDiscount = [];
        this.isEmpty = false;
        this.productOrder = {};
    }

    async ngOnInit() {
        setTimeout(() => {
            this.cartId = localStorage.getItem('cartId');
            this.shoppingCartSubscription = this.shoppingCartService.find(this.cartId).subscribe((res: HttpResponse<IShoppingCart>) => {
                this.shoppingCart(res.body.orderItems);
                this.getTotalQuantity();
                this.getTotalPrice();
            });
        }, 500);
        this.account = await this.accountService.identity().then((account: Account) => {
            this.setOrder(account);
            return (this.account = account);
        });
        this.voucherTemp = true;
        this.isVoucherChecked = false;
        this.voucherNotFound = true;
        this.voucherNotifNotFound = false;
        this.isBelowMinOrder = false;
    }
    setOrder(account: any) {
        this.order.name = account.login;
        this.order.email = account.email;
        this.order.loginId = account.id;
    }
    protected shoppingCart(data: IOrderItem[]) {
        for (let i = 0; i < data.length; i++) {
            this.orderItem.push(data[i]);
        }
        this.orderItem.sort((a, b) => (a.product.productName < b.product.productName ? -1 : 1));
    }

    protected getTotalQuantity() {
        const totalItem = this.orderItem.map(t => t.quantity);
        let itemCount = 0;
        for (let id = 0; id < totalItem.length; id++) {
            itemCount += totalItem[id];
        }
        this.quantity = itemCount;
        if (this.quantity === 0) {
            this.isEmpty = true;
        } else {
            this.isEmpty = false;
        }
    }
    protected getTotalPrice() {
        let itemCount = 0;
        for (let id = 0; id < this.orderItem.length; id++) {
            itemCount += this.orderItem[id].quantity * this.orderItem[id].product.price;
        }
        this.totalPrice = itemCount;
        this.totalAfterDiscount = this.totalPrice - 0;
    }

    ngOnDestroy() {
        if (this.voucherSubscription) {
            this.voucherSubscription.unsubscribe();
        }
        if (this.deleteSubscription) {
            this.deleteSubscription.unsubscribe();
        }
        if (this.shoppingCartSubscription) {
            this.shoppingCartSubscription.unsubscribe();
        }
        if (this.productOrderSubscription) {
            this.productOrderSubscription.unsubscribe();
        }
        if (this.invoiceSubscription) {
            this.invoiceSubscription.unsubscribe();
        }
    }

    voucherChecked() {
        const temp1 = this.isVoucherChecked;
        this.isVoucherChecked = this.voucherTemp;
        this.voucherTemp = temp1;
        if (!this.isVoucherChecked) {
            this.order.voucher = null;
            this.voucherNotFound = true;
            this.totalAfterDiscount = this.totalPrice - 0;
        }
    }

    applyVoucher(voucher) {
        this.productDiscount = [];
        this.loadAll(voucher);
    }

    loadAll(voucher) {
        this.voucherSubscription = this.productDiscountService
            .query({})
            .subscribe((res: HttpResponse<IProductDiscount[]>) => this.allProductDiscount(res.body, voucher));
    }
    allProductDiscount(body: IProductDiscount[], voucher: string): void {
        for (let i = 0; i < body.length; i++) {
            this.productDiscount.push(body[i]);
        }
        this.productDiscount = this.productDiscount.filter(data => data.voucherCode.toLowerCase() === voucher.toLowerCase());
        if (this.productDiscount.length < 1) {
            this.voucherNotFound = true;
            this.voucherNotifNotFound = true;
            this.totalAfterDiscount = this.totalPrice - 0;
            setTimeout(() => {
                this.voucherNotifNotFound = false;
            }, 3000);
        } else {
            const discVoucher = this.productDiscount.find(data => data.voucherCode.toLowerCase() === voucher.toLowerCase()).discountValue;
            this.minimumOrder = this.productDiscount.find(
                data => data.voucherCode.toLowerCase() === voucher.toLowerCase()
            ).minimumOrderValue;
            if (this.totalPrice > this.minimumOrder) {
                this.voucherNotFound = false;
                this.totalAfterDiscount = this.totalPrice - discVoucher;
                this.voucherApplied = true;
                setTimeout(() => {
                    this.voucherApplied = false;
                }, 3000);
            } else {
                this.isBelowMinOrder = true;
                setTimeout(() => {
                    this.isBelowMinOrder = false;
                }, 3000);
            }
        }
    }

    placeOrder() {
        this.paymentType = this.order.paymentType;
        if (this.paymentType === PaymentMethod.ONESTOPCLICK) {
            // not yet implemented
        } else if (this.paymentType === PaymentMethod.PAYPAL) {
            this.productOrder.status = Orderstatus.PENDING;
            this.invoiceStatus = InvoiceStatus.ISSUED;
            const newDateString = moment().format('DD/MM/YYYY');
            const dateMoment = moment(newDateString, 'DD/MM/YYYY');
            this.users = [
                {
                    id: this.order.loginId,
                    login: this.order.name,
                    email: this.order.email
                }
            ];
            this.productOrder.placeDate = dateMoment;
            this.productOrder.users = this.users;
            this.productOrder.orderItems = this.orderItem;
            if (!this.voucherNotFound) {
                this.productOrder.code = this.order.voucher;
            } else {
                this.productOrder.code = 'No Voucher';
            }
            this.subscribeToSaveResponsePAYPAL(this.productOrderService.create(this.productOrder));
        } else if (this.paymentType === PaymentMethod.FREE) {
            this.productOrder.status = Orderstatus.COMPLETED;
            this.invoiceStatus = InvoiceStatus.PAID;
            const newDateString = moment().format('DD/MM/YYYY');
            const dateMoment = moment(newDateString, 'DD/MM/YYYY');
            this.users = [
                {
                    id: this.order.loginId,
                    login: this.order.name,
                    email: this.order.email
                }
            ];
            this.productOrder.placeDate = dateMoment;
            this.productOrder.users = this.users;
            this.productOrder.orderItems = this.orderItem;
            if (!this.voucherNotFound) {
                this.productOrder.code = this.order.voucher;
            } else {
                this.productOrder.code = 'No Voucher';
            }
            this.subscribeToSaveResponseFREE(this.productOrderService.create(this.productOrder));
        }
    }
    protected subscribeToSaveResponsePAYPAL(result: Observable<HttpResponse<IProductOrder>>) {
        this.productOrderSubscription = result.subscribe((res: HttpResponse<IProductOrder>) => this.onSaveSuccessPAYPAL(res.body));
    }
    protected subscribeToSaveResponseFREE(result: Observable<HttpResponse<IProductOrder>>) {
        this.productOrderSubscription = result.subscribe((res: HttpResponse<IProductOrder>) => this.onSaveSuccessFREE(res.body));
    }
    onSaveSuccessPAYPAL(body: IProductOrder): void {
        this.createInvoice(body);
        this.updateOrderItems(body);
        setTimeout(() => {
            // this.deleteSubscription = this.shoppingCartService.delete(this.cartId).subscribe();
            // localStorage.removeItem('cartId');
            localStorage.removeItem('anonymCartId');
            const statusPayment = body.status;
            if (statusPayment === Orderstatus.COMPLETED) {
                this.route.navigate(['checkout/purchase-confirmation', this.invoiceId]);
            } else if (statusPayment === Orderstatus.PENDING) {
                this.route.navigate(['checkout/payment', this.invoiceId]);
            }
        }, 1000);
    }
    onSaveSuccessFREE(body: IProductOrder): void {
        this.createInvoice(body);
        this.updateOrderItems(body);
        setTimeout(() => {
            this.deleteSubscription = this.shoppingCartService.delete(this.cartId).subscribe();
            localStorage.removeItem('cartId');
            localStorage.removeItem('anonymCartId');
            const statusPayment = body.status;
            if (statusPayment === Orderstatus.COMPLETED) {
                this.route.navigate(['checkout/purchase-confirmation', this.invoiceId]);
            } else if (statusPayment === Orderstatus.PENDING) {
                this.route.navigate(['checkout/payment', this.invoiceId]);
            }
        }, 1000);
    }
    async updateOrderItems(body: IProductOrder) {
        for (let i = 0; i < this.orderItem.length; i++) {
            this.orderItem[i].productOrder = body;
            await this.orderItemService.update(this.orderItem[i]).subscribe();
        }
    }
    createInvoice(dataProductOrder: ProductOrder) {
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        let detailInvoice;
        if (!this.voucherNotFound) {
            detailInvoice = 'Using voucher : ' + this.order.voucher;
        } else {
            detailInvoice = 'No voucher used';
        }
        this.invoices.date = dateMoment;
        this.invoices.code = 'ALL';
        this.invoices.paymentDate = dateMoment;
        this.invoices.detail = detailInvoice;
        this.invoices.status = this.invoiceStatus;
        this.invoices.paymentMethod = this.paymentType;
        (this.invoices.paymentAmount = this.totalAfterDiscount), (this.invoices.productOrder = dataProductOrder);

        this.invoiceSubscription = this.invoiceService
            .create(this.invoices)
            .subscribe((res: HttpResponse<IInvoice>) => this.onSaveSuccessInvoice(res.body));
    }
    onSaveSuccessInvoice(body: IInvoice): void {
        this.invoiceId = body.id;
    }
}
