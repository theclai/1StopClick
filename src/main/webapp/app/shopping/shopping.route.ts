import { Routes } from '@angular/router';
import { productInfoRoute, shoppingCartRoute, checkoutRoute } from './';

const SHOPPING_ROUTES = [productInfoRoute, shoppingCartRoute, checkoutRoute];
export const shoppingState: Routes = [
    {
        path: '',
        children: SHOPPING_ROUTES
    }
];
