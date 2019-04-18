import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'category',
                loadChildren: './category/category.module#AppCategoryModule'
            },
            {
                path: 'category',
                loadChildren: './category/category.module#AppCategoryModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product-review',
                loadChildren: './product-review/product-review.module#AppProductReviewModule'
            },
            {
                path: 'product-review',
                loadChildren: './product-review/product-review.module#AppProductReviewModule'
            },
            {
                path: 'product-review',
                loadChildren: './product-review/product-review.module#AppProductReviewModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            },
            {
                path: 'product',
                loadChildren: './product/product.module#AppProductModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppEntityModule {}
