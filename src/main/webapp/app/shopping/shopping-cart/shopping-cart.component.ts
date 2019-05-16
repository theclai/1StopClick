import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'app/entities/shopping-cart';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IOrderItem, OrderItem } from 'app/shared/model/order-item.model';
import { Subscription, Observable } from 'rxjs';
import { OrderItemService } from 'app/entities/order-item';
import * as moment from 'moment';
import { AccountService, IUser } from 'app/core';

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
    anonymCartSub: Subscription;
    orderItemAnonym: OrderItem;
    updateCartSub: Subscription;
    user: IUser;
    account: Account;
    anonymCartSub1: Subscription;
    isProductExist: boolean;

    constructor(
        private shoppingCartService: ShoppingCartService,
        private orderItemService: OrderItemService,
        private router: Router,
        private accountService: AccountService
    ) {
        this.orderItem = [];
        this.user = {};
        this.isEmpty = false;
        this.orderItemAnonym = {};
    }

    async ngOnInit() {
        this.isProductExist = false;
        this.account = await this.accountService.identity().then((account: Account) => {
            this.setAccount(account);
            return (this.account = account);
        });
        setTimeout(() => {
            const anonymCart = localStorage.getItem('anonymCartId');
            const cartId = localStorage.getItem('cartId');
            this.shoppingCartSubscription = this.shoppingCartService.find(cartId).subscribe(
                (res: HttpResponse<IShoppingCart>) => {
                    this.shoppingCart(res.body.orderItems);
                    if (anonymCart) {
                        if (anonymCart !== cartId) {
                            this.getDataAnonymCartAndCombine(anonymCart, res.body);
                        } else {
                            const shop = res.body;
                            shop.user = this.user;
                            this.updateCartSub = this.shoppingCartService.update(shop).subscribe();
                        }
                    }
                    this.getTotalQuantity();
                    this.getTotalPrice();
                },
                (res: HttpErrorResponse) => this.onError(res.status)
            );
        }, 150);
    }

    setAccount(account: any) {
        if (!(account === null)) {
            this.user.login = account.login;
            this.user.email = account.email;
            this.user.id = account.id;
        }
    }
    getDataAnonymCartAndCombine(anonymCart: string, shoppingCart: IShoppingCart) {
        this.anonymCartSub = this.shoppingCartService.find(anonymCart).subscribe((res: HttpResponse<IShoppingCart>) => {
            const dataAnonymCart = res.body.orderItems.pop();
            this.shoppingCartAnonym(dataAnonymCart);
            for (let x = 0; x < this.orderItem.length; x++) {
                const productId = this.orderItem[x].product.id;
                const productAnonym = this.orderItemAnonym.product.id;
                if (productId === productAnonym) {
                    this.isProductExist = true;
                }
            }
            if (!this.isProductExist) {
                this.orderItem.push(this.orderItemAnonym);
            }
            this.orderItem.sort((a, b) => (a.product.productName < b.product.productName ? -1 : 1));
            shoppingCart.orderItems = this.orderItem;
            shoppingCart.user = this.user;
            this.updateCartSub = this.shoppingCartService.update(shoppingCart).subscribe(x => {
                const anonymCartId = localStorage.getItem('anonymCartId');
                this.anonymCartSub1 = this.shoppingCartService.delete(anonymCartId).subscribe();
                localStorage.removeItem('anonymCartId');
            });
            this.getTotalQuantity();
            this.getTotalPrice();
        });
    }
    protected shoppingCartAnonym(data: IOrderItem) {
        this.orderItemAnonym = data;
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
        if (this.anonymCartSub) {
            this.anonymCartSub.unsubscribe();
        }
        if (this.anonymCartSub1) {
            this.anonymCartSub1.unsubscribe();
        }
        if (this.updateCartSub) {
            this.updateCartSub.unsubscribe();
        }
    }
    public getTotalQuantity() {
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
    protected shoppingCart(data: IOrderItem[]) {
        for (let i = 0; i < data.length; i++) {
            this.orderItem.push(data[i]);
        }
        this.orderItem.sort((a, b) => (a.product.productName < b.product.productName ? -1 : 1));
    }

    removeFromCart(x: OrderItem) {
        if (x.quantity <= 1) {
            this.deleteFromCart(x);
        } else {
            this.updateQuantity(x, -1);
        }
    }
    async deleteFromCart(x: OrderItem) {
        const result = confirm('Remove this item from your Shopping Cart?');
        if (result) {
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
            this.getTotalQuantity();
            this.getTotalPrice();
        }
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
        const result = confirm('Are you sure?');
        if (result) {
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

    async checkout() {
        const cartId = localStorage.getItem('cartId');
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        const shoppingCart = {
            id: cartId,
            date: dateMoment,
            orderItems: this.orderItem,
            user: this.user
        };
        await this.shoppingCartService.update(shoppingCart).subscribe();
        this.router.navigate(['checkout']);
    }
}
