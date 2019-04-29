import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'app/entities/shopping-cart';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IOrderItem, OrderItem } from 'app/shared/model/order-item.model';
import { Subscription, Observable } from 'rxjs';
import { OrderItemService } from 'app/entities/order-item';
import moment = require('moment');

@Component({
    selector: 'jhi-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styles: []
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
    orderItem: OrderItem[];
    quantity: number;
    totalPrice: number;
    isEmpty: boolean;
    shoppingCartSubscription: Subscription;

    constructor(private shoppingCartService: ShoppingCartService, private orderItemService: OrderItemService) {
        this.orderItem = [];
        this.isEmpty = false;
    }

    ngOnInit() {
        const cartId = localStorage.getItem('cartId');
        this.shoppingCartSubscription = this.shoppingCartService.find(cartId).subscribe(
            (res: HttpResponse<IShoppingCart>) => {
                this.shoppingCart(res.body.orderItems);
                console.log('order item >>>>', this.orderItem);
                this.getTotalQuantity();
                this.getTotalPrice();
                this.isEmpty = false;
            },
            (res: HttpErrorResponse) => this.onError(res.status)
        );
    }
    onError(status: number): void {
        if (status === 404) {
            this.isEmpty = true;
        }
    }
    protected getTotalPrice() {
        let itemCount = 0;
        for (let id = 0; id < this.orderItem.length; id++) {
            itemCount += this.orderItem[id].quantity * this.orderItem[id].product.price;
        }
        this.totalPrice = itemCount;
    }

    ngOnDestroy() {
        if (this.shoppingCartSubscription) {
            this.shoppingCartSubscription.unsubscribe();
        }
    }
    public getTotalQuantity() {
        const totalItem = this.orderItem.map(t => t.quantity);
        let itemCount = 0;
        for (let id = 0; id < totalItem.length; id++) {
            itemCount += totalItem[id];
        }
        this.quantity = itemCount;
    }
    protected shoppingCart(data: IOrderItem[]) {
        for (let i = 0; i < data.length; i++) {
            this.orderItem.push(data[i]);
        }
    }

    removeFromCart(x: OrderItem) {
        if (x.quantity <= 1) {
            this.deleteFromCart(x);
        } else {
            this.updateQuantity(x, -1);
        }
    }
    async deleteFromCart(x: OrderItem) {
        const cartId = localStorage.getItem('cartId');
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        await this.orderItemService.delete(x.id).subscribe();
        const a = this.orderItem.findIndex(item => item.id === x.id);
        this.orderItem.splice(a, 1);
        const shoppingCart = {
            id: cartId,
            date: dateMoment,
            orderItems: this.orderItem
        };
        await this.shoppingCartService.update(shoppingCart).subscribe();
    }
    protected updateQuantity(x: OrderItem, arg0: number) {
        const currQuantity = x.quantity;
        x.quantity = currQuantity + arg0;
        this.orderItem.find(item => item.id === x.id).quantity = currQuantity + arg0;
        this.subscribeToSaveResponse(this.orderItemService.update(x));
    }

    addToCart(x: OrderItem) {
        this.updateQuantity(x, 1);
    }
    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>) {
        result.subscribe(data => {
            this.getTotalQuantity();
            this.getTotalPrice();
        });
    }
    async clearShoppingCart() {
        const cartId = localStorage.getItem('cartId');
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        const shoppingCart = {
            id: cartId,
            date: dateMoment,
            orderItems: []
        };
        for (let i = 0; i < this.orderItem.length; i++) {
            // tslint:disable-next-line: prefer-const
            let orderItemId = this.orderItem[i].id;
            await this.orderItemService.delete(orderItemId).subscribe();
        }
        await this.shoppingCartService.update(shoppingCart).subscribe();
        this.isEmpty = true;
    }
}
