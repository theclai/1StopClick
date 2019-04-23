import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';

import { ProductInfoComponent, shoppingState } from './';
@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(shoppingState)],
    declarations: [ProductInfoComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppShoppingModule {}
