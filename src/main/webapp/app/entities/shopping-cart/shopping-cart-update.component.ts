import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-shopping-cart-update',
    templateUrl: './shopping-cart-update.component.html'
})
export class ShoppingCartUpdateComponent implements OnInit {
    shoppingCart: IShoppingCart;
    isSaving: boolean;

    users: IUser[];
    date: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected shoppingCartService: ShoppingCartService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shoppingCart }) => {
            this.shoppingCart = shoppingCart;
            this.date = this.shoppingCart.date != null ? this.shoppingCart.date.format(DATE_TIME_FORMAT) : null;
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
        this.shoppingCart.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.shoppingCart.id !== undefined) {
            this.subscribeToSaveResponse(this.shoppingCartService.update(this.shoppingCart));
        } else {
            this.subscribeToSaveResponse(this.shoppingCartService.create(this.shoppingCart));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShoppingCart>>) {
        result.subscribe((res: HttpResponse<IShoppingCart>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
