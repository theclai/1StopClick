import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { AppSharedModule } from 'app/shared';
import {
    ProductReviewComponent,
    ProductReviewDetailComponent,
    ProductReviewUpdateComponent,
    ProductReviewDeletePopupComponent,
    ProductReviewDeleteDialogComponent,
    productReviewRoute,
    productReviewPopupRoute
} from './';

const ENTITY_STATES = [...productReviewRoute, ...productReviewPopupRoute];

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductReviewComponent,
        ProductReviewDetailComponent,
        ProductReviewUpdateComponent,
        ProductReviewDeleteDialogComponent,
        ProductReviewDeletePopupComponent
    ],
    entryComponents: [
        ProductReviewComponent,
        ProductReviewUpdateComponent,
        ProductReviewDeleteDialogComponent,
        ProductReviewDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppProductReviewModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
