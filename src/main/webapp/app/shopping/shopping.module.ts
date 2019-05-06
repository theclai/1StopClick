import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';

import { ProductInfoComponent, shoppingState } from './';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PurchaseConfirmationComponent } from './purchase-confirmation/purchase-confirmation.component';
import { PaymentComponent } from './payment/payment.component';
@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(shoppingState)],
    declarations: [ProductInfoComponent, ShoppingCartComponent, CheckoutComponent, PurchaseConfirmationComponent, PaymentComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppShoppingModule {}
