import { CheckoutComponent } from './checkout.component';
import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core';

export const checkoutRoute: Route = {
    path: 'checkout',
    component: CheckoutComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'home.checkout'
    },
    canActivate: [UserRouteAccessService]
};
