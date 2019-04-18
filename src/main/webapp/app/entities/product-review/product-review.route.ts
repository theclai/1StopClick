import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductReview } from 'app/shared/model/product-review.model';
import { ProductReviewService } from './product-review.service';
import { ProductReviewComponent } from './product-review.component';
import { ProductReviewDetailComponent } from './product-review-detail.component';
import { ProductReviewUpdateComponent } from './product-review-update.component';
import { ProductReviewDeletePopupComponent } from './product-review-delete-dialog.component';
import { IProductReview } from 'app/shared/model/product-review.model';

@Injectable({ providedIn: 'root' })
export class ProductReviewResolve implements Resolve<IProductReview> {
    constructor(private service: ProductReviewService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductReview> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductReview>) => response.ok),
                map((productReview: HttpResponse<ProductReview>) => productReview.body)
            );
        }
        return of(new ProductReview());
    }
}

export const productReviewRoute: Routes = [
    {
        path: '',
        component: ProductReviewComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'App.productReview.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductReviewDetailComponent,
        resolve: {
            productReview: ProductReviewResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productReview.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductReviewUpdateComponent,
        resolve: {
            productReview: ProductReviewResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productReview.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductReviewUpdateComponent,
        resolve: {
            productReview: ProductReviewResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productReview.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productReviewPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductReviewDeletePopupComponent,
        resolve: {
            productReview: ProductReviewResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.productReview.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
