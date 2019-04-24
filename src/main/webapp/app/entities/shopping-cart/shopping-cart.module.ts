import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { AppSharedModule } from 'app/shared';
import {
    ShoppingCartComponent,
    ShoppingCartDetailComponent,
    ShoppingCartUpdateComponent,
    ShoppingCartDeletePopupComponent,
    ShoppingCartDeleteDialogComponent,
    shoppingCartRoute,
    shoppingCartPopupRoute
} from './';

const ENTITY_STATES = [...shoppingCartRoute, ...shoppingCartPopupRoute];

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ShoppingCartComponent,
        ShoppingCartDetailComponent,
        ShoppingCartUpdateComponent,
        ShoppingCartDeleteDialogComponent,
        ShoppingCartDeletePopupComponent
    ],
    entryComponents: [
        ShoppingCartComponent,
        ShoppingCartUpdateComponent,
        ShoppingCartDeleteDialogComponent,
        ShoppingCartDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppShoppingCartModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
