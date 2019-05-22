import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvoiceService } from 'app/entities/invoice';
import { IInvoice } from 'app/shared/model/invoice.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ProductService } from 'app/entities/product';
import { ProductOrderService } from 'app/entities/product-order';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { IProduct } from 'app/shared/model/product.model';
import { DetailModalService } from '../my-orders/detail-modal.service';
import { IProductReview } from 'app/shared/model/product-review.model';

@Component({
    selector: 'jhi-purchase-confirmation',
    templateUrl: './purchase-confirmation.component.html',
    styles: []
})
export class PurchaseConfirmationComponent implements OnInit, OnDestroy {
    invoiceId;
    string;
    invoiceSubscription: Subscription;
    invoice: IInvoice;
    products: IProduct[];
    productOrderSubscription: Subscription;
    modalRef: any;
    dataReview: IProductReview;
    reviewSuccess: boolean;
    notifReview: string;
    constructor(
        private invoiceService: InvoiceService,
        private route: ActivatedRoute,
        private router: Router,
        private productOrderService: ProductOrderService,
        private detailModalService: DetailModalService
    ) {
        this.invoice = {};
        this.products = [];
    }

    ngOnInit() {
        this.invoiceId = this.route.snapshot.paramMap.get('invoiceId');
        this.invoiceSubscription = this.invoiceService.find(this.invoiceId).subscribe(
            (res: HttpResponse<IInvoice>) => {
                this.generateInvoice(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.status)
        );
    }
    onError(status: number): void {
        if (status === 404) {
            this.router.navigate(['404']);
        }
    }
    generateInvoice(body: IInvoice) {
        this.invoice = body;
        this.generateProductOrder(this.invoice.productOrder.id);
    }

    generateProductOrder(id: string) {
        this.productOrderSubscription = this.productOrderService.find(id).subscribe((res: HttpResponse<IProductOrder>) => {
            this.generateOrderItem(res.body.orderItems);
        });
    }
    generateOrderItem(orderItems: IOrderItem[]) {
        this.products = orderItems.map(data => data.product);
    }

    ngOnDestroy() {
        if (this.invoiceSubscription) {
            this.invoiceSubscription.unsubscribe();
        }
        if (this.productOrderSubscription) {
            this.productOrderSubscription.unsubscribe();
        }
    }
    openReview(productId: string) {
        this.modalRef = this.detailModalService.openReview();
        this.modalRef.componentInstance.productId = productId;
        this.modalRef.componentInstance.passToParent.subscribe((dataFromPopUp: IProductReview) => {
            this.dataReview = dataFromPopUp;
            this.reviewSuccess = true;
            this.notifReview = this.dataReview.product.productName;
            setTimeout(() => {
                this.reviewSuccess = false;
            }, 5000);
        });
    }
}
