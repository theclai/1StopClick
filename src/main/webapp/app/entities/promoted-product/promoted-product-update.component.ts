import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IPromotedProduct, PromotedStatus } from 'app/shared/model/promoted-product.model';
import { PromotedProductService } from './promoted-product.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';

@Component({
    selector: 'jhi-promoted-product-update',
    templateUrl: './promoted-product-update.component.html'
})
export class PromotedProductUpdateComponent implements OnInit {
    promotedProduct: IPromotedProduct;
    isSaving: boolean;

    promotedproducts: IProduct[];
    createdDateDp: any;
    existingPromotedProduct: IPromotedProduct[];
    isExists: boolean;
    notifExist: string;
    isStatusActive: PromotedStatus;
    isExpired: boolean;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected promotedProductService: PromotedProductService,
        protected productService: ProductService,
        protected activatedRoute: ActivatedRoute
    ) {
        this.existingPromotedProduct = [];
        this.isExists = false;
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ promotedProduct }) => {
            this.promotedProduct = promotedProduct;
            if (this.promotedProduct.status === PromotedStatus.EXPIRED) {
                this.isExpired = true;
            } else {
                this.isExpired = false;
            }
        });
        this.productService
            .query({ filter: 'product-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProduct[]>) => response.body)
            )
            .subscribe(
                (res: IProduct[]) => {
                    if (!this.promotedProduct.promotedProduct || !this.promotedProduct.promotedProduct.id) {
                        this.promotedproducts = res;
                    } else {
                        this.productService
                            .find(this.promotedProduct.promotedProduct.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IProduct>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IProduct>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IProduct) => {
                                    this.promotedproducts = [subRes].concat(res);
                                },
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.promotedProduct.id !== undefined) {
            this.subscribeToSaveResponse(this.promotedProductService.update(this.promotedProduct));
        } else {
            this.checkExistingPromotedProduct();
        }
    }
    protected async checkExistingPromotedProduct() {
        await this.promotedProductService.query().subscribe((res: HttpResponse<IPromotedProduct[]>) => this.allPromotedProduct(res.body));
    }
    protected allPromotedProduct(data: IPromotedProduct[]): void {
        for (let i = 0; i < data.length; i++) {
            this.existingPromotedProduct.push(data[i]);
        }
        const exist = this.existingPromotedProduct.find(
            x => x.promotedProduct.id.toLowerCase() === this.promotedProduct.promotedProduct.id.toLowerCase()
        );
        if (exist === undefined) {
            this.isExists = false;
        } else {
            this.isStatusActive = this.existingPromotedProduct.find(
                x => x.promotedProduct.id.toLowerCase() === this.promotedProduct.promotedProduct.id.toLowerCase()
            ).status;
            if (this.isStatusActive === PromotedStatus.ACTIVE) {
                this.isExists = true;
                this.notifExist = this.promotedProduct.promotedProduct.productName;
            } else {
                this.isExists = false;
            }
        }
        if (!this.isExists) {
            if (this.promotedProduct.id !== undefined) {
                this.subscribeToSaveResponse(this.promotedProductService.update(this.promotedProduct));
            } else {
                this.subscribeToSaveResponse(this.promotedProductService.create(this.promotedProduct));
            }
        }
        setTimeout(() => {
            this.isExists = false;
            this.isSaving = false;
        }, 3000);
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPromotedProduct>>) {
        result.subscribe((res: HttpResponse<IPromotedProduct>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
