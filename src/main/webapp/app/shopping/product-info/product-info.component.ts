import { PromotedProductService } from './../../entities/promoted-product/promoted-product.service';
import { IUser } from './../../core/user/user.model';
import { AccountService, LoginModalService, StateStorageService } from 'app/core';
import { ShoppingCart } from './../../shared/model/shopping-cart.model';
import { ShoppingCartService } from './../../entities/shopping-cart/shopping-cart.service';
import { OrderItemService } from 'app/entities/order-item/order-item.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/entities/product';
import { Subscription, Observable } from 'rxjs';
import { IProduct } from 'app/shared/model/product.model';
import { HttpResponse } from '@angular/common/http';
import { OrderItem, OrderItemStatus, IOrderItem } from 'app/shared/model/order-item.model';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { NgbModalRef, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { IPromotedProduct, PromotedStatus } from 'app/shared/model/promoted-product.model';
import { OwnedProductService } from 'app/entities/owned-product';
import { IOwnedProduct } from 'app/shared/model/owned-product.model';
import { ProductReviewService } from 'app/entities/product-review';
import { IProductReview } from 'app/shared/model/product-review.model';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';

@Component({
    selector: 'jhi-product-info',
    templateUrl: './product-info.component.html',
    styleUrls: ['product-info.scss']
})
export class ProductInfoComponent implements OnInit, OnDestroy {
    fbIcon = faFacebookF;
    tweetIcon = faTwitter;
    linkedInIcon = faLinkedin;
    whatsappIcon = faWhatsapp;
    @Input() rating: number;
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
    account: Account;
    user: IUser;
    modalRef: NgbModalRef;
    myCarouselImages = [
        'https://farm8.staticflickr.com/7575/15558990730_339784c63c_b.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81xLbzSlFWL._SY606_.jpg',
        'http://kissfmmedan.com/wp-content/uploads/2018/09/pubg-hero.jpg'
    ];
    promotedSubscription: Subscription;
    promotedProduct: IPromotedProduct[];
    ownedProduct: IOwnedProduct;
    ownedItem: boolean;
    productReview: IProductReview[];
    productReviewSub: Subscription;

    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private productService: ProductService,
        private orderItemService: OrderItemService,
        private shoppingCartService: ShoppingCartService,
        private accountService: AccountService,
        private stateStorageService: StateStorageService,
        private loginModalService: LoginModalService,
        private config: NgbCarouselConfig,
        private promotedProductService: PromotedProductService,
        private ownedProductService: OwnedProductService,
        private productReviewService: ProductReviewService
    ) {
        this.product = [];
        this.productReview = [];
        this.shoppingCart = {};
        this.orderItem = [];
        this.quantity = [1];
        this.user = {};
        this.ownedItem = false;
        this.config.showNavigationArrows = true;
        this.config.pauseOnHover = true;
        this.config.interval = 5000;
        this.ownedProduct = {};
        this.promotedProduct = [];
    }

    async ngOnInit() {
        this.productID = this.router.snapshot.paramMap.get('id');
        this.loadProduct(this.productID);

        this.account = await this.accountService.identity().then((account: Account) => {
            this.setAccount(account);
            return (this.account = account);
        });

        this.promotedSubscription = this.promotedProductService
            .query()
            .subscribe((res: HttpResponse<IPromotedProduct[]>) => this.AllPromotedCategory(res.body));
        setTimeout(() => {
            this.productReviewSub = this.productReviewService
                .query()
                .subscribe((res: HttpResponse<IProductReview[]>) => this.generateProductReview(res.body));
        }, 700);
    }
    generateProductReview(data: IProductReview[]): void {
        for (let j = 0; j < data.length; j++) {
            const temp = data[j].product;
            if (temp.id === this.productID) {
                this.productReview.push(data[j]);
            }
        }
    }
    AllPromotedCategory(data: IPromotedProduct[]): void {
        for (let i = 0; i < data.length; i++) {
            this.promotedProduct.push(data[i]);
        }
        this.promotedProduct = this.promotedProduct.filter(x => x.status === PromotedStatus.ACTIVE);
    }
    setAccount(account: any) {
        if (!(account === null)) {
            this.user.login = account.login;
            this.user.email = account.email;
            this.user.id = account.id;

            this.ownedProductService.query({}).subscribe((res: HttpResponse<IOwnedProduct[]>) => {
                this.ownedProduct = res.body.find(x => x.user.id === this.user.id);
                const productIsOwned = this.ownedProduct.products.find(x => x.id === this.productID);
                if (!(productIsOwned === undefined)) {
                    this.ownedItem = true;
                } else {
                    this.ownedItem = false;
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
        if (this.shoppingCartSubscription) {
            this.shoppingCartSubscription.unsubscribe();
        }
        if (this.productReviewSub) {
            this.productReviewSub.unsubscribe();
        }
    }

    protected loadProduct(productId: string) {
        this.productSubscription = this.productService.find(productId).subscribe((res: HttpResponse<IProduct>) => {
            this.product.push(res.body);
        });
    }

    async addToCart(product: IProduct) {
        if (this.account === null) {
            const currentUrl = this.route.url;
            this.route.navigate(['accessdenied']);
            this.stateStorageService.storeUrl(currentUrl);
            this.modalRef = this.loginModalService.open();
            return;
        } else {
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
        localStorage.setItem('anonymCartId', this.cart);
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        const orderItem: OrderItem = {};
        this.shoppingCart = {
            id: this.cart,
            date: dateMoment,
            user: this.user
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
            user: this.user,
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
            orderItems: this.orderItem,
            user: this.user
        };
        this.addItemsToCart(this.shoppingCartService.update(this.shoppingCart));

        this.route.navigate(['cart']);
    }

    protected existingShoppingCart(data: IOrderItem[]) {
        for (let i = 0; i < data.length; i++) {
            this.orderItem.push(data[i]);
        }
    }
    productDetail(productID) {
        if (productID !== this.productID) {
            this.route.navigate(['product-info', productID]);
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }
}
