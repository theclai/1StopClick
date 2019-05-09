import { OrderItemService } from 'app/entities/order-item/order-item.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/entities/product';
import { Subscription, Observable } from 'rxjs';
import { IProduct } from 'app/shared/model/product.model';
import { HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { OrderItem, OrderItemStatus, IOrderItem } from 'app/shared/model/order-item.model';

@Component({
    selector: 'jhi-product-info',
    templateUrl: './product-info.component.html',
    styles: []
})
export class ProductInfoComponent implements OnInit, OnDestroy {
    productID: any;
    product: IProduct[];
    productSubscription: Subscription;
    quantity: number[];
    selectedQuantity = 1;

    constructor(private router: ActivatedRoute, private productService: ProductService, private orderItemService: OrderItemService) {
        this.product = [];
        this.quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    ngOnInit() {
        this.productID = this.router.snapshot.paramMap.get('id');
        this.loadProduct(this.productID);
        console.log(this.product);
    }

    ngOnDestroy() {
        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
    }

    protected loadProduct(productId: string) {
        this.productSubscription = this.productService.find(productId).subscribe((res: HttpResponse<IProduct>) => {
            this.product.push(res.body);
        });
    }

    addToCart(product: IProduct) {
        const orderItem: OrderItem = {};
        orderItem.product = product;
        orderItem.quantity = this.selectedQuantity;
        orderItem.status = OrderItemStatus.AVAILABLE;
        orderItem.totalPrice = this.selectedQuantity * product.price;
        console.log('order item>>>>>>>>>>>>>>', orderItem);
        if (orderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
        } else {
            this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>) {
        result.subscribe((res: HttpResponse<IOrderItem>) => {});
    }
}
