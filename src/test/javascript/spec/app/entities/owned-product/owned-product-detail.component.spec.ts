/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { OwnedProductDetailComponent } from 'app/entities/owned-product/owned-product-detail.component';
import { OwnedProduct } from 'app/shared/model/owned-product.model';

describe('Component Tests', () => {
    describe('OwnedProduct Management Detail Component', () => {
        let comp: OwnedProductDetailComponent;
        let fixture: ComponentFixture<OwnedProductDetailComponent>;
        const route = ({ data: of({ ownedProduct: new OwnedProduct('123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [OwnedProductDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(OwnedProductDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OwnedProductDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.ownedProduct).toEqual(jasmine.objectContaining({ id: '123' }));
            });
        });
    });
});
