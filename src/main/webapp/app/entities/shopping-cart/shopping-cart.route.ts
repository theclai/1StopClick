import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartComponent } from './shopping-cart.component';
import { ShoppingCartDetailComponent } from './shopping-cart-detail.component';
import { ShoppingCartUpdateComponent } from './shopping-cart-update.component';
import { ShoppingCartDeletePopupComponent } from './shopping-cart-delete-dialog.component';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartResolve implements Resolve<IShoppingCart> {
    constructor(private service: ShoppingCartService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShoppingCart> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ShoppingCart>) => response.ok),
                map((shoppingCart: HttpResponse<ShoppingCart>) => shoppingCart.body)
            );
        }
        return of(new ShoppingCart());
    }
}

export const shoppingCartRoute: Routes = [
    {
        path: '',
        component: ShoppingCartComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'App.shoppingCart.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ShoppingCartDetailComponent,
        resolve: {
            shoppingCart: ShoppingCartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.shoppingCart.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ShoppingCartUpdateComponent,
        resolve: {
            shoppingCart: ShoppingCartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.shoppingCart.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ShoppingCartUpdateComponent,
        resolve: {
            shoppingCart: ShoppingCartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.shoppingCart.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shoppingCartPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ShoppingCartDeletePopupComponent,
        resolve: {
            shoppingCart: ShoppingCartResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'App.shoppingCart.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
