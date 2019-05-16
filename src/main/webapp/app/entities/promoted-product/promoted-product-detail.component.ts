import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPromotedProduct } from 'app/shared/model/promoted-product.model';

@Component({
    selector: 'jhi-promoted-product-detail',
    templateUrl: './promoted-product-detail.component.html'
})
export class PromotedProductDetailComponent implements OnInit {
    promotedProduct: IPromotedProduct;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ promotedProduct }) => {
            this.promotedProduct = promotedProduct;
        });
    }

    previousState() {
        window.history.back();
    }
}
