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
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'order-item',
                loadChildren: './order-item/order-item.module#AppOrderItemModule'
            },
            {
                path: 'invoice',
                loadChildren: './invoice/invoice.module#AppInvoiceModule'
            },
            {
                path: 'shipment',
                loadChildren: './shipment/shipment.module#AppShipmentModule'
            },
            {
                path: 'invoice',
                loadChildren: './invoice/invoice.module#AppInvoiceModule'
            },
            {
                path: 'invoice',
                loadChildren: './invoice/invoice.module#AppInvoiceModule'
            },
            {
                path: 'invoice',
                loadChildren: './invoice/invoice.module#AppInvoiceModule'
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'product-review',
                loadChildren: './product-review/product-review.module#AppProductReviewModule'
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'invoice',
                loadChildren: './invoice/invoice.module#AppInvoiceModule'
            },
            {
                path: 'invoice',
                loadChildren: './invoice/invoice.module#AppInvoiceModule'
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'product-order',
                loadChildren: './product-order/product-order.module#AppProductOrderModule'
            },
            {
                path: 'order-item',
                loadChildren: './order-item/order-item.module#AppOrderItemModule'
            },
            {
                path: 'order-item',
                loadChildren: './order-item/order-item.module#AppOrderItemModule'
            },
            {
                path: 'shipment',
                loadChildren: './shipment/shipment.module#AppShipmentModule'
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
