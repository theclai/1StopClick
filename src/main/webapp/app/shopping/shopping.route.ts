import { Routes } from '@angular/router';
import { productInfoRoute } from './';
import { shoppingCartRoute } from './shopping-cart/shopping-cart.route';

const SHOPPING_ROUTES = [productInfoRoute, shoppingCartRoute];
export const shoppingState: Routes = [
    {
        path: '',
        children: SHOPPING_ROUTES
    }
];
