/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { ProductReviewDetailComponent } from 'app/entities/product-review/product-review-detail.component';
import { ProductReview } from 'app/shared/model/product-review.model';

describe('Component Tests', () => {
    describe('ProductReview Management Detail Component', () => {
        let comp: ProductReviewDetailComponent;
        let fixture: ComponentFixture<ProductReviewDetailComponent>;
        const route = ({ data: of({ productReview: new ProductReview('123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [ProductReviewDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductReviewDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductReviewDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productReview).toEqual(jasmine.objectContaining({ id: '123' }));
            });
        });
    });
});
