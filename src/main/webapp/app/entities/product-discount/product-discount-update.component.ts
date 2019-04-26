import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IProductDiscount } from 'app/shared/model/product-discount.model';
import { ProductDiscountService } from './product-discount.service';

@Component({
    selector: 'jhi-product-discount-update',
    templateUrl: './product-discount-update.component.html'
})
export class ProductDiscountUpdateComponent implements OnInit {
    productDiscount: IProductDiscount;
    isSaving: boolean;
    date: string;

    constructor(protected productDiscountService: ProductDiscountService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productDiscount }) => {
            this.productDiscount = productDiscount;
            this.date = this.productDiscount.date != null ? this.productDiscount.date.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.productDiscount.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.productDiscount.id !== undefined) {
            this.subscribeToSaveResponse(this.productDiscountService.update(this.productDiscount));
        } else {
            this.subscribeToSaveResponse(this.productDiscountService.create(this.productDiscount));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductDiscount>>) {
        result.subscribe((res: HttpResponse<IProductDiscount>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
