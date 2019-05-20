import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { AppSharedModule } from 'app/shared';
import {
    OwnedProductComponent,
    OwnedProductDetailComponent,
    OwnedProductUpdateComponent,
    OwnedProductDeletePopupComponent,
    OwnedProductDeleteDialogComponent,
    ownedProductRoute,
    ownedProductPopupRoute
} from './';

const ENTITY_STATES = [...ownedProductRoute, ...ownedProductPopupRoute];

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        OwnedProductComponent,
        OwnedProductDetailComponent,
        OwnedProductUpdateComponent,
        OwnedProductDeleteDialogComponent,
        OwnedProductDeletePopupComponent
    ],
    entryComponents: [
        OwnedProductComponent,
        OwnedProductUpdateComponent,
        OwnedProductDeleteDialogComponent,
        OwnedProductDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppOwnedProductModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
