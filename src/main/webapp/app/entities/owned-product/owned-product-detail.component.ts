import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOwnedProduct } from 'app/shared/model/owned-product.model';

@Component({
    selector: 'jhi-owned-product-detail',
    templateUrl: './owned-product-detail.component.html'
})
export class OwnedProductDetailComponent implements OnInit {
    ownedProduct: IOwnedProduct;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ ownedProduct }) => {
            this.ownedProduct = ownedProduct;
        });
    }

    previousState() {
        window.history.back();
    }
}
