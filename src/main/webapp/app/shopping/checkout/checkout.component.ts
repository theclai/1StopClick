import { ProductDiscountService } from 'app/entities/product-discount';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrderItem, IOrderItem } from 'app/shared/model/order-item.model';
import { ShoppingCartService } from 'app/entities/shopping-cart';
import { HttpResponse } from '@angular/common/http';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { AccountService } from 'app/core';
import { IProductDiscount } from 'app/shared/model/product-discount.model';

@Component({
    selector: 'jhi-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['checkout.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    orderItem: OrderItem[];
    cartId: string;
    quantity: number;
    totalPrice: number;
    order: any = {};
    userId: string;
    isEmpty: boolean;
    shoppingCartSubscription: Subscription;
    account: Account;
    public options = [
        { value: '1stopclick', id: 'onestopclick-icon', name: 'OneStop Pay' },
        { value: 'paypal', id: 'paypal-icon', name: 'Paypal' },
        { value: 'free', id: 'visa-icon', name: 'Free (for test)' }
    ];
    voucherTemp: boolean;
    isVoucherChecked: boolean;
    productDiscount: IProductDiscount[];
    voucherSubscription: Subscription;
    voucherNotFound: boolean;
    totalAfterDiscount: number;
    voucherNotifNotFound: boolean;

    constructor(
        private shoppingCartService: ShoppingCartService,
        private accountService: AccountService,
        private productDiscountService: ProductDiscountService
    ) {
        this.orderItem = [];
        this.productDiscount = [];
        this.isEmpty = false;
    }

    async ngOnInit() {
        this.cartId = localStorage.getItem('cartId');
        this.shoppingCartSubscription = this.shoppingCartService.find(this.cartId).subscribe((res: HttpResponse<IShoppingCart>) => {
            this.shoppingCart(res.body.orderItems);
            this.getTotalQuantity();
            this.getTotalPrice();
        });
        this.account = await this.accountService.identity().then((account: Account) => {
            this.setOrder(account);
            return (this.account = account);
        });
        this.voucherTemp = true;
        this.isVoucherChecked = false;
        this.voucherNotFound = true;
        this.voucherNotifNotFound = false;
    }
    setOrder(account: any) {
        this.order.name = account.login;
        this.order.email = account.email;
    }
    protected shoppingCart(data: IOrderItem[]) {
        for (let i = 0; i < data.length; i++) {
            this.orderItem.push(data[i]);
        }
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

    placeOrder() {
        console.log('shipping detail : ', this.order);
    }

    ngOnDestroy() {
        if (this.voucherSubscription) {
            this.voucherSubscription.unsubscribe();
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
            this.voucherNotFound = false;
            const discVoucher = this.productDiscount.find(data => data.voucherCode.toLowerCase() === voucher.toLowerCase()).discountValue;
            this.totalAfterDiscount = this.totalPrice - discVoucher;
        }
    }
}
