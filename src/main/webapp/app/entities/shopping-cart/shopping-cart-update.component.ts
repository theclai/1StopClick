import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
    selector: 'jhi-shopping-cart-update',
    templateUrl: './shopping-cart-update.component.html'
})
export class ShoppingCartUpdateComponent implements OnInit {
    shoppingCart: IShoppingCart;
    isSaving: boolean;
    date: string;

    constructor(protected shoppingCartService: ShoppingCartService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shoppingCart }) => {
            this.shoppingCart = shoppingCart;
            this.date = this.shoppingCart.date != null ? this.shoppingCart.date.format(DATE_TIME_FORMAT) : null;
        });
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
}
