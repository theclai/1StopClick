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

    constructor(
        private invoiceService: InvoiceService,
        private route: ActivatedRoute,
        private router: Router,
        private paypalService: PaypalService,
        private productOrderService: ProductOrderService
    ) {
        this.initiatePaypalUrl = {};
        this.afterPayment = {};
        this.afterSuccessPayment = false;
        this.invoice = {};
        this.productOrder = {};
        this.orderItem = [];
    }
    ngOnInit() {
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
        if (this.productOrderSubscription) {
            this.productOrderSubscription.unsubscribe();
        }
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
    changePaymentMethod() {
        this.router.navigate(['checkout']);
    }

    async makePayment(sum: number) {
        const sumUSD = (sum / 15000).toFixed(2);
        const currentOrigin = document.location.origin;
        const currentUrl = this.router.url;
        await this.paypalService.makePayment(sumUSD, currentOrigin, currentUrl).subscribe((res: any) => {
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
        this.productOrder.placeDate = dateMoment;
        this.productOrder.status = Orderstatus.COMPLETED;
        this.productOrder.orderItems = this.orderItem;
        this.invoice.status = InvoiceStatus.PAID;
        this.afterSuccessPayment = true;
        setTimeout(() => {
            this.router.navigate(['checkout/purchase-confirmation', this.invoiceId]);
        }, 1000);
        await this.invoiceService.update(this.invoice).subscribe();
        await this.productOrderService.update(this.productOrder).subscribe();
    }
}
