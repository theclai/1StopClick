import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductDiscount } from 'app/shared/model/product-discount.model';

@Component({
    selector: 'jhi-product-discount-detail',
    templateUrl: './product-discount-detail.component.html'
})
export class ProductDiscountDetailComponent implements OnInit {
    productDiscount: IProductDiscount;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productDiscount }) => {
            this.productDiscount = productDiscount;
        });
    }

    previousState() {
        window.history.back();
    }
}
