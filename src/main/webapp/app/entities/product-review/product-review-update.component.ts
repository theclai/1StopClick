import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IProductReview } from 'app/shared/model/product-review.model';
import { ProductReviewService } from './product-review.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';

@Component({
    selector: 'jhi-product-review-update',
    templateUrl: './product-review-update.component.html'
})
export class ProductReviewUpdateComponent implements OnInit {
    productReview: IProductReview;
    isSaving: boolean;

    products: IProduct[];
    dateDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productReviewService: ProductReviewService,
        protected productService: ProductService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productReview }) => {
            this.productReview = productReview;
        });
        this.productService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProduct[]>) => response.body)
            )
            .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.productReview.id !== undefined) {
            this.subscribeToSaveResponse(this.productReviewService.update(this.productReview));
        } else {
            this.subscribeToSaveResponse(this.productReviewService.create(this.productReview));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductReview>>) {
        result.subscribe((res: HttpResponse<IProductReview>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackProductById(index: number, item: IProduct) {
        return item.id;
    }
}
