import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PromotedProduct } from 'app/shared/model/promoted-product.model';
import { PromotedProductService } from './promoted-product.service';
import { PromotedProductComponent } from './promoted-product.component';
import { PromotedProductDetailComponent } from './promoted-product-detail.component';
import { PromotedProductUpdateComponent } from './promoted-product-update.component';
import { PromotedProductDeletePopupComponent } from './promoted-product-delete-dialog.component';
import { IPromotedProduct } from 'app/shared/model/promoted-product.model';

@Injectable({ providedIn: 'root' })
export class PromotedProductResolve implements Resolve<IPromotedProduct> {
    constructor(private service: PromotedProductService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPromotedProduct> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PromotedProduct>) => response.ok),
                map((promotedProduct: HttpResponse<PromotedProduct>) => promotedProduct.body)
            );
        }
        return of(new PromotedProduct());
    }
}

export const promotedProductRoute: Routes = [
    {
        path: '',
        component: PromotedProductComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'App.promotedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PromotedProductDetailComponent,
        resolve: {
            promotedProduct: PromotedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.promotedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PromotedProductUpdateComponent,
        resolve: {
            promotedProduct: PromotedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.promotedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PromotedProductUpdateComponent,
        resolve: {
            promotedProduct: PromotedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.promotedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const promotedProductPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PromotedProductDeletePopupComponent,
        resolve: {
            promotedProduct: PromotedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.promotedProduct.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
