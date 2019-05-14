import { Route } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { UserRouteAccessService } from 'app/core';

export const paymentRoute: Route = {
    path: 'checkout/payment/:invoiceId',
    component: PaymentComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'home.payment'
    },
    canActivate: [UserRouteAccessService]
};
