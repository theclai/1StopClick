import { ProductInfoComponent } from './product-info.component';
import { Route } from '@angular/router';

export const productInfoRoute: Route = {
    path: 'product-info/:id',
    component: ProductInfoComponent,
    data: {
        authorities: [],
        pageTitle: 'Product info'
    }
};
