import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductReview } from 'app/shared/model/product-review.model';

@Component({
    selector: 'jhi-product-review-detail',
    templateUrl: './product-review-detail.component.html'
})
export class ProductReviewDetailComponent implements OnInit {
    productReview: IProductReview;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productReview }) => {
            this.productReview = productReview;
        });
    }

    previousState() {
        window.history.back();
    }
}
