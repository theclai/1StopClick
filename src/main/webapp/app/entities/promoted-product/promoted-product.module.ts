import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { AppSharedModule } from 'app/shared';
import {
    PromotedProductComponent,
    PromotedProductDetailComponent,
    PromotedProductUpdateComponent,
    PromotedProductDeletePopupComponent,
    PromotedProductDeleteDialogComponent,
    promotedProductRoute,
    promotedProductPopupRoute
} from './';

const ENTITY_STATES = [...promotedProductRoute, ...promotedProductPopupRoute];

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PromotedProductComponent,
        PromotedProductDetailComponent,
        PromotedProductUpdateComponent,
        PromotedProductDeleteDialogComponent,
        PromotedProductDeletePopupComponent
    ],
    entryComponents: [
        PromotedProductComponent,
        PromotedProductUpdateComponent,
        PromotedProductDeleteDialogComponent,
        PromotedProductDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppPromotedProductModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
