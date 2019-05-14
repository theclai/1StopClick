import { Route } from '@angular/router';

import { ShoppingCartComponent } from './shopping-cart.component';
import { UserRouteAccessService } from 'app/core';

export const shoppingCartRoute: Route = {
    path: 'cart',
    component: ShoppingCartComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'home.shoppingCart'
    },
    canActivate: [UserRouteAccessService]
};
