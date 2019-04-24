import { Route } from '@angular/router';

import { ShoppingCartComponent } from './shopping-cart.component';

export const shoppingCartRoute: Route = {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    data: {
        authorities: [],
        pageTitle: 'shopping cart'
    }
};
