import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductDiscount } from 'app/shared/model/product-discount.model';
import { ProductDiscountService } from './product-discount.service';
import { ProductDiscountComponent } from './product-discount.component';
import { ProductDiscountDetailComponent } from './product-discount-detail.component';
import { ProductDiscountUpdateComponent } from './product-discount-update.component';
import { ProductDiscountDeletePopupComponent } from './product-discount-delete-dialog.component';
import { IProductDiscount } from 'app/shared/model/product-discount.model';

@Injectable({ providedIn: 'root' })
export class ProductDiscountResolve implements Resolve<IProductDiscount> {
    constructor(private service: ProductDiscountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductDiscount> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductDiscount>) => response.ok),
                map((productDiscount: HttpResponse<ProductDiscount>) => productDiscount.body)
            );
        }
        return of(new ProductDiscount());
    }
}

export const productDiscountRoute: Routes = [
    {
        path: '',
        component: ProductDiscountComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'App.productDiscount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductDiscountDetailComponent,
        resolve: {
            productDiscount: ProductDiscountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productDiscount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductDiscountUpdateComponent,
        resolve: {
            productDiscount: ProductDiscountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productDiscount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductDiscountUpdateComponent,
        resolve: {
            productDiscount: ProductDiscountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productDiscount.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productDiscountPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductDiscountDeletePopupComponent,
        resolve: {
            productDiscount: ProductDiscountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productDiscount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
