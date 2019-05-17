import { MyOrdersComponent } from './my-orders.component';
import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core';

export const myOrdersRoute: Route = {
    path: 'my-order',
    component: MyOrdersComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'home.myOrder'
    },
    canActivate: [UserRouteAccessService]
};
