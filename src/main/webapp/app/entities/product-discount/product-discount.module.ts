import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { AppSharedModule } from 'app/shared';
import {
    ProductDiscountComponent,
    ProductDiscountDetailComponent,
    ProductDiscountUpdateComponent,
    ProductDiscountDeletePopupComponent,
    ProductDiscountDeleteDialogComponent,
    productDiscountRoute,
    productDiscountPopupRoute
} from './';

const ENTITY_STATES = [...productDiscountRoute, ...productDiscountPopupRoute];

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductDiscountComponent,
        ProductDiscountDetailComponent,
        ProductDiscountUpdateComponent,
        ProductDiscountDeleteDialogComponent,
        ProductDiscountDeletePopupComponent
    ],
    entryComponents: [
        ProductDiscountComponent,
        ProductDiscountUpdateComponent,
        ProductDiscountDeleteDialogComponent,
        ProductDiscountDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppProductDiscountModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
