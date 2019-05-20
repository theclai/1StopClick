import { Route } from '@angular/router';
import { MyProductsComponent } from './my-products.component';
import { UserRouteAccessService } from 'app/core';

export const myProductsRoute: Route = {
    path: 'my-product',
    component: MyProductsComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'home.myOrder'
    },
    canActivate: [UserRouteAccessService]
};
