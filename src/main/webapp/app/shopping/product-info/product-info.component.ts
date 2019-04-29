import { ShoppingCart } from './../../shared/model/shopping-cart.model';
import { ShoppingCartService } from './../../entities/shopping-cart/shopping-cart.service';
import { OrderItemService } from 'app/entities/order-item/order-item.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/entities/product';
import { Subscription, Observable } from 'rxjs';
import { IProduct } from 'app/shared/model/product.model';
import { HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { OrderItem, OrderItemStatus, IOrderItem } from 'app/shared/model/order-item.model';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import moment = require('moment');

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
    shoppingCart: ShoppingCart;
    cart: string;
    orderId: string;
    shoppingCartSubscription: Subscription;
    orderItem: OrderItem[];

    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private productService: ProductService,
        private orderItemService: OrderItemService,
        private shoppingCartService: ShoppingCartService
    ) {
        this.product = [];
        this.shoppingCart = {};
        this.orderItem = [];
        this.quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    ngOnInit() {
        this.productID = this.router.snapshot.paramMap.get('id');
        this.loadProduct(this.productID);
    }

    ngOnDestroy() {
        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
        if (this.shoppingCartSubscription) {
            this.shoppingCartSubscription.unsubscribe();
        }
    }

    protected loadProduct(productId: string) {
        this.productSubscription = this.productService.find(productId).subscribe((res: HttpResponse<IProduct>) => {
            this.product.push(res.body);
        });
    }

    async addToCart(product: IProduct) {
        const cartId = localStorage.getItem('cartId');
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        let orderItem: OrderItem = {};
        if (!cartId || cartId === undefined) {
            this.shoppingCart = {
                id: null,
                date: dateMoment
            };
            await this.createShoppingCart(this.shoppingCartService.create(this.shoppingCart), product);
        } else {
            this.shoppingCartSubscription = this.shoppingCartService.find(cartId).subscribe((res: HttpResponse<IShoppingCart>) => {
                this.existingShoppingCart(res.body.orderItems);
                if (this.orderItem.find(item => item.product.id === product.id)) {
                    this.orderItem.find(item => item.product.id === product.id).quantity = this.selectedQuantity;
                    orderItem = this.orderItem.find(item => item.product.id === product.id);
                    this.subscribeToUpdateResponse(this.orderItemService.update(orderItem));
                } else {
                    this.shoppingCart = {
                        id: cartId,
                        date: dateMoment
                    };
                    setTimeout(() => {
                        orderItem.product = product;
                        orderItem.quantity = this.selectedQuantity;
                        orderItem.status = OrderItemStatus.AVAILABLE;
                        orderItem.totalPrice = this.selectedQuantity * product.price;
                        orderItem.shoppingCart = this.shoppingCart;
                        this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
                    }, 1000);
                }
            });
        }
    }
    protected addItemsToCart(result: Observable<HttpResponse<IShoppingCart>>) {
        result.subscribe((res: HttpResponse<IShoppingCart>) => {});
    }

    createShoppingCart(result: Observable<HttpResponse<IShoppingCart>>, product: IProduct) {
        result.subscribe((res: HttpResponse<IShoppingCart>) => {
            this.onSaveSuccessCreatingShoppingCart(res, product);
        });
    }
    protected onSaveSuccessCreatingShoppingCart(res, product: IProduct) {
        this.cart = res.body.id;
        localStorage.setItem('cartId', this.cart);
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        const orderItem: OrderItem = {};
        this.shoppingCart = {
            id: this.cart,
            date: dateMoment
        };
        setTimeout(() => {
            orderItem.product = product;
            orderItem.quantity = this.selectedQuantity;
            orderItem.status = OrderItemStatus.AVAILABLE;
            orderItem.totalPrice = this.selectedQuantity * product.price;
            orderItem.shoppingCart = this.shoppingCart;
            this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
        }, 1000);
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>) {
        result.subscribe((res: HttpResponse<IOrderItem>) => {
            this.onSaveSuccess(res.body);
        });
    }
    protected subscribeToUpdateResponse(result: Observable<HttpResponse<IOrderItem>>) {
        result.subscribe((res: HttpResponse<IOrderItem>) => {
            this.onUpdateSuccess(res.body);
        });
    }
    protected onSaveSuccess(res: IOrderItem) {
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        this.orderItem.push(res);
        this.shoppingCart = {
            id: res.shoppingCart.id,
            date: dateMoment,
            orderItems: this.orderItem
        };
        this.addItemsToCart(this.shoppingCartService.update(this.shoppingCart));
        this.route.navigate(['cart']);
    }
    protected onUpdateSuccess(res: IOrderItem) {
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        this.shoppingCart = {
            id: res.shoppingCart.id,
            date: dateMoment,
            orderItems: this.orderItem
        };
        this.addItemsToCart(this.shoppingCartService.update(this.shoppingCart));

        this.route.navigate(['cart']);
    }

    protected existingShoppingCart(data: IOrderItem[]) {
        for (let i = 0; i < data.length; i++) {
            this.orderItem.push(data[i]);
        }
    }
}
