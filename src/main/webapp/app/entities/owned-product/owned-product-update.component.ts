import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOwnedProduct } from 'app/shared/model/owned-product.model';
import { OwnedProductService } from './owned-product.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-owned-product-update',
    templateUrl: './owned-product-update.component.html'
})
export class OwnedProductUpdateComponent implements OnInit {
    ownedProduct: IOwnedProduct;
    isSaving: boolean;

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected ownedProductService: OwnedProductService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ ownedProduct }) => {
            this.ownedProduct = ownedProduct;
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
        if (this.ownedProduct.id !== undefined) {
            this.subscribeToSaveResponse(this.ownedProductService.update(this.ownedProduct));
        } else {
            this.subscribeToSaveResponse(this.ownedProductService.create(this.ownedProduct));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOwnedProduct>>) {
        result.subscribe((res: HttpResponse<IOwnedProduct>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
