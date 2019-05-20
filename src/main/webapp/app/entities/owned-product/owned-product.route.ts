import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OwnedProduct } from 'app/shared/model/owned-product.model';
import { OwnedProductService } from './owned-product.service';
import { OwnedProductComponent } from './owned-product.component';
import { OwnedProductDetailComponent } from './owned-product-detail.component';
import { OwnedProductUpdateComponent } from './owned-product-update.component';
import { OwnedProductDeletePopupComponent } from './owned-product-delete-dialog.component';
import { IOwnedProduct } from 'app/shared/model/owned-product.model';

@Injectable({ providedIn: 'root' })
export class OwnedProductResolve implements Resolve<IOwnedProduct> {
    constructor(private service: OwnedProductService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOwnedProduct> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<OwnedProduct>) => response.ok),
                map((ownedProduct: HttpResponse<OwnedProduct>) => ownedProduct.body)
            );
        }
        return of(new OwnedProduct());
    }
}

export const ownedProductRoute: Routes = [
    {
        path: '',
        component: OwnedProductComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'App.ownedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: OwnedProductDetailComponent,
        resolve: {
            ownedProduct: OwnedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.ownedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: OwnedProductUpdateComponent,
        resolve: {
            ownedProduct: OwnedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.ownedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: OwnedProductUpdateComponent,
        resolve: {
            ownedProduct: OwnedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.ownedProduct.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const ownedProductPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: OwnedProductDeletePopupComponent,
        resolve: {
            ownedProduct: OwnedProductResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.ownedProduct.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
