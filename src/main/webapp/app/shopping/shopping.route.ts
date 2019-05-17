import { Routes } from '@angular/router';
import { productInfoRoute, shoppingCartRoute, checkoutRoute, purchaseConfirmationRoute, paymentRoute, myOrdersRoute } from './';

const SHOPPING_ROUTES = [productInfoRoute, shoppingCartRoute, checkoutRoute, purchaseConfirmationRoute, paymentRoute, myOrdersRoute];
export const shoppingState: Routes = [
    {
        path: '',
        children: SHOPPING_ROUTES
    }
];
