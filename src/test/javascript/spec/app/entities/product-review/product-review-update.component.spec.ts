/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { ProductReviewUpdateComponent } from 'app/entities/product-review/product-review-update.component';
import { ProductReviewService } from 'app/entities/product-review/product-review.service';
import { ProductReview } from 'app/shared/model/product-review.model';

describe('Component Tests', () => {
    describe('ProductReview Management Update Component', () => {
        let comp: ProductReviewUpdateComponent;
        let fixture: ComponentFixture<ProductReviewUpdateComponent>;
        let service: ProductReviewService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [ProductReviewUpdateComponent]
            })
                .overrideTemplate(ProductReviewUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductReviewUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductReviewService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductReview('123');
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productReview = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductReview();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productReview = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
