import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { ProductInfoComponent, shoppingState } from './';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PurchaseConfirmationComponent } from './purchase-confirmation/purchase-confirmation.component';
import { PaymentComponent } from './payment/payment.component';
import { FacebookShareComponent } from './product-info/facebook-share/facebook-share.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { DetailComponent } from './my-orders/detail/detail.component';
import { DownloadComponent } from './my-orders/download/download.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { ReviewComponent } from './my-products/review/review.component';
import { TwitterShareComponent } from './product-info/twitter-share/twitter-share.component';
import { LinkedInShareComponent } from './product-info/linked-in-share/linked-in-share.component';
import { ShareButtonModule } from '@ngx-share/button';

@NgModule({
    imports: [AppSharedModule, HttpClientModule, ShareButtonModule, RouterModule.forChild(shoppingState)],
    declarations: [
        ProductInfoComponent,
        ShoppingCartComponent,
        CheckoutComponent,
        PurchaseConfirmationComponent,
        PaymentComponent,
        FacebookShareComponent,
        MyOrdersComponent,
        DetailComponent,
        DownloadComponent,
        MyProductsComponent,
        ReviewComponent,
        TwitterShareComponent,
        LinkedInShareComponent
    ],
    entryComponents: [DetailComponent, DownloadComponent, ReviewComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppShoppingModule {}
