import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { ProductOrderService } from './product-order.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-product-order-update',
    templateUrl: './product-order-update.component.html'
})
export class ProductOrderUpdateComponent implements OnInit {
    productOrder: IProductOrder;
    isSaving: boolean;

    users: IUser[];
    placeDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productOrderService: ProductOrderService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productOrder }) => {
            this.productOrder = productOrder;
            this.placeDate = this.productOrder.placeDate != null ? this.productOrder.placeDate.format(DATE_TIME_FORMAT) : null;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.productOrder.placeDate = this.placeDate != null ? moment(this.placeDate, DATE_TIME_FORMAT) : null;
        if (this.productOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.productOrderService.update(this.productOrder));
        } else {
            this.subscribeToSaveResponse(this.productOrderService.create(this.productOrder));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductOrder>>) {
        result.subscribe((res: HttpResponse<IProductOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
