import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';

import { ProductInfoComponent, shoppingState } from './';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(shoppingState)],
    declarations: [ProductInfoComponent, ShoppingCartComponent, CheckoutComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppShoppingModule {}
