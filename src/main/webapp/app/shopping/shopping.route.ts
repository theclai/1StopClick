import { Routes } from '@angular/router';
import {
    productInfoRoute,
    shoppingCartRoute,
    checkoutRoute,
    purchaseConfirmationRoute,
    paymentRoute,
    myOrdersRoute,
    myProductsRoute
} from './';

const SHOPPING_ROUTES = [
    productInfoRoute,
    shoppingCartRoute,
    checkoutRoute,
    purchaseConfirmationRoute,
    paymentRoute,
    myOrdersRoute,
    myProductsRoute
];
export const shoppingState: Routes = [
    {
        path: '',
        children: SHOPPING_ROUTES
    }
];
