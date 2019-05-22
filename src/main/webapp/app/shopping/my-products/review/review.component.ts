import { ProductReviewService } from 'app/entities/product-review/product-review.service';
import { AccountService, IUser } from 'app/core';
import { ProductService } from 'app/entities/product/product.service';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from 'app/shared/model/product.model';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { IProductReview } from 'app/shared/model/product-review.model';

@Component({
    selector: 'jhi-review',
    templateUrl: './review.component.html',
    styleUrls: ['review.scss']
})
export class ReviewComponent implements OnInit, OnDestroy {
    @Input() public productId;
    @Input() rating: number;
    @Input() itemId: number;
    @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() passToParent: EventEmitter<any> = new EventEmitter();
    productSubscription: Subscription;
    account: Account;
    user: IUser;
    product: IProduct;
    review = '';
    notif: string;
    errorSubmit: boolean;
    productReview: IProductReview;
    currentProductReview: IProductReview[];
    haveReview: boolean;
    haveReviewDuration: boolean;
    constructor(
        public activeModal: NgbActiveModal,
        private productService: ProductService,
        private productReviewService: ProductReviewService,
        private accountService: AccountService
    ) {
        this.user = {};
        this.productReview = {};
        this.currentProductReview = [];
        this.product = {};
    }

    ngOnDestroy() {
        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
    }

    async ngOnInit() {
        this.account = await this.accountService.identity().then((account: Account) => {
            this.setAccount(account);
            return (this.account = account);
        });
        setTimeout(() => {
            this.productReviewService.query().subscribe((res: HttpResponse<IProductReview[]>) => this.generateProductReview(res.body));
            this.productSubscription = this.productService.find(this.productId).subscribe((res: HttpResponse<IProduct>) => {
                this.product = res.body;
            });
        }, 500);
    }
    generateProductReview(data: IProductReview[]): void {
        for (let j = 0; j < data.length; j++) {
            const temp = data[j].user;
            if (temp.id === this.user.id) {
                const tempReview = data.find(x => x.product.id === this.productId);
                if (tempReview) {
                    this.rating = tempReview.rating;
                    this.review = tempReview.review;
                    this.haveReview = true;
                    this.haveReviewDuration = true;
                    setTimeout(() => {
                        this.haveReviewDuration = false;
                    }, 5000);
                }
                // this.currentProductReview.push(data[j]);
            }
        }
    }
    setAccount(account: any) {
        if (!(account === null)) {
            this.user.login = account.login;
            this.user.email = account.email;
            this.user.id = account.id;
        }
    }

    onClick(rating: number): void {
        this.rating = rating;
        this.ratingClick.emit({
            itemId: this.itemId,
            // tslint:disable-next-line: object-literal-shorthand
            rating: rating
        });
    }

    async submitReview() {
        if (this.rating === undefined) {
            this.notif = 'Please Select a Rating';
            this.errorSubmit = true;
            setTimeout(() => {
                this.errorSubmit = false;
            }, 3000);
            return;
        }
        if (this.review === '') {
            this.notif = 'Please Give Your Review';
            this.errorSubmit = true;
            setTimeout(() => {
                this.errorSubmit = false;
            }, 3000);
            return;
        }
        const newDateString = moment().format('DD/MM/YYYY');
        const dateMoment = moment(newDateString, 'DD/MM/YYYY');
        this.productReview.date = dateMoment;
        this.productReview.product = this.product;
        this.productReview.rating = this.rating;
        this.productReview.review = this.review;
        this.productReview.user = this.user;

        await this.productReviewService.create(this.productReview).subscribe(x => {
            this.passToParent.emit(this.productReview);
            this.activeModal.dismiss('closed');
            /*  setTimeout(() => {
        window.location.reload();
    }, 50); */
        });
    }
}
