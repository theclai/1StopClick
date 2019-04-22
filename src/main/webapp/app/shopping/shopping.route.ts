import { Routes } from '@angular/router';
import { productInfoRoute } from './';

const SHOPPING_ROUTES = [productInfoRoute];
export const shoppingState: Routes = [
    {
        path: '',
        children: SHOPPING_ROUTES
    }
];
