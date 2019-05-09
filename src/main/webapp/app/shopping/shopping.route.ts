import { Routes } from '@angular/router';
import { productInfoRoute, shoppingCartRoute, checkoutRoute, purchaseConfirmationRoute, paymentRoute } from './';

const SHOPPING_ROUTES = [productInfoRoute, shoppingCartRoute, checkoutRoute, purchaseConfirmationRoute, paymentRoute];
export const shoppingState: Routes = [
    {
        path: '',
        children: SHOPPING_ROUTES
    }
];
