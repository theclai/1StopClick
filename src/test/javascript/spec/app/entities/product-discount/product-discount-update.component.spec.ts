/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { ProductDiscountUpdateComponent } from 'app/entities/product-discount/product-discount-update.component';
import { ProductDiscountService } from 'app/entities/product-discount/product-discount.service';
import { ProductDiscount } from 'app/shared/model/product-discount.model';

describe('Component Tests', () => {
    describe('ProductDiscount Management Update Component', () => {
        let comp: ProductDiscountUpdateComponent;
        let fixture: ComponentFixture<ProductDiscountUpdateComponent>;
        let service: ProductDiscountService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [ProductDiscountUpdateComponent]
            })
                .overrideTemplate(ProductDiscountUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductDiscountUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductDiscountService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductDiscount('123');
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productDiscount = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductDiscount();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productDiscount = entity;
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
