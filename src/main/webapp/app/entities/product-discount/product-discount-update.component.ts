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
    productDisc: IProductDiscount[];
    isExists: boolean;

    constructor(protected productDiscountService: ProductDiscountService, protected activatedRoute: ActivatedRoute) {
        this.productDisc = [];
        this.isExists = false;
    }

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
        if (this.productDiscount.id !== undefined) {
            this.subscribeToSaveResponse(this.productDiscountService.update(this.productDiscount));
        } else {
            this.checkExistingVoucherCode();
        }
    }
    protected async checkExistingVoucherCode() {
        await this.productDiscountService.query().subscribe((res: HttpResponse<IProductDiscount[]>) => this.AllProductDiscount(res.body));
    }
    protected AllProductDiscount(data: IProductDiscount[]): void {
        for (let i = 0; i < data.length; i++) {
            this.productDisc.push(data[i]);
        }
        const exist = this.productDisc.find(x => x.voucherCode.toLowerCase() === this.productDiscount.voucherCode.toLowerCase());
        if (exist === undefined) {
            this.isExists = false;
        } else {
            this.isExists = true;
        }
        if (!this.isExists) {
            this.productDiscount.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
            if (this.productDiscount.id !== undefined) {
                this.subscribeToSaveResponse(this.productDiscountService.update(this.productDiscount));
            } else {
                this.subscribeToSaveResponse(this.productDiscountService.create(this.productDiscount));
            }
        }

        setTimeout(() => {
            this.isExists = false;
            this.isSaving = false;
        }, 3000);
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
