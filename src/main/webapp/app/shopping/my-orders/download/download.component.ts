import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { HttpResponse } from '@angular/common/http';
import { IInvoice } from 'app/shared/model/invoice.model';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { Subscription } from 'rxjs';
import { IProduct } from 'app/shared/model/product.model';
import { InvoiceService } from 'app/entities/invoice';
import { ProductOrderService } from 'app/entities/product-order';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-download',
    templateUrl: './download.component.html',
    styles: []
})
export class DownloadComponent implements OnInit, OnDestroy {
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
