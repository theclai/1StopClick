import { Subscription } from 'rxjs';
import { ProductOrderService } from 'app/entities/product-order/product-order.service';
import { InvoiceService } from './../../../entities/invoice/invoice.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IInvoice } from 'app/shared/model/invoice.model';
import { HttpResponse } from '@angular/common/http';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { IProduct } from 'app/shared/model/product.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-detail',
    templateUrl: './detail.component.html',
    styles: []
})
export class DetailComponent implements OnInit, OnDestroy {
    @Input() public productOrderId;
    invoice: IInvoice[];
    products: IProduct[];
    productOrderSubscription: Subscription;
    stillWaiting: boolean;
    constructor(
        private invoiceService: InvoiceService,
        private productOrderService: ProductOrderService,
        public activeModal: NgbActiveModal
    ) {
        this.invoice = [];
        this.products = [];
    }

    ngOnDestroy() {
        if (this.productOrderSubscription) {
            this.productOrderSubscription.unsubscribe();
        }
    }

    async ngOnInit() {
        await this.invoiceService.query().subscribe((res: HttpResponse<IInvoice[]>) => {
            this.invoice = res.body.filter(y => y.productOrder.id === this.productOrderId);
        });
        this.stillWaiting = true;
        setTimeout(() => {
            this.productOrderSubscription = this.productOrderService
                .find(this.productOrderId)
                .subscribe((res: HttpResponse<IProductOrder>) => {
                    this.generateOrderItem(res.body.orderItems);
                });
        }, 500);
    }
    generateOrderItem(orderItems: IOrderItem[]) {
        this.products = orderItems.map(data => data.product);
        this.stillWaiting = false;
    }
}
