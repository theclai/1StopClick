/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { ProductDiscountDetailComponent } from 'app/entities/product-discount/product-discount-detail.component';
import { ProductDiscount } from 'app/shared/model/product-discount.model';

describe('Component Tests', () => {
    describe('ProductDiscount Management Detail Component', () => {
        let comp: ProductDiscountDetailComponent;
        let fixture: ComponentFixture<ProductDiscountDetailComponent>;
        const route = ({ data: of({ productDiscount: new ProductDiscount('123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [ProductDiscountDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductDiscountDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductDiscountDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productDiscount).toEqual(jasmine.objectContaining({ id: '123' }));
            });
        });
    });
});
