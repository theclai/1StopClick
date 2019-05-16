/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { PromotedProductDetailComponent } from 'app/entities/promoted-product/promoted-product-detail.component';
import { PromotedProduct } from 'app/shared/model/promoted-product.model';

describe('Component Tests', () => {
    describe('PromotedProduct Management Detail Component', () => {
        let comp: PromotedProductDetailComponent;
        let fixture: ComponentFixture<PromotedProductDetailComponent>;
        const route = ({ data: of({ promotedProduct: new PromotedProduct('123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [PromotedProductDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PromotedProductDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PromotedProductDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.promotedProduct).toEqual(jasmine.objectContaining({ id: '123' }));
            });
        });
    });
});
