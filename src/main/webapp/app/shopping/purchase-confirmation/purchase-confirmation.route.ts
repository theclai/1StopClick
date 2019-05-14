import { Route } from '@angular/router';
import { PurchaseConfirmationComponent } from './purchase-confirmation.component';
import { UserRouteAccessService } from 'app/core';

export const purchaseConfirmationRoute: Route = {
    path: 'checkout/purchase-confirmation/:invoiceId',
    component: PurchaseConfirmationComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'home.purchaseConfirmation'
    },
    canActivate: [UserRouteAccessService]
};
