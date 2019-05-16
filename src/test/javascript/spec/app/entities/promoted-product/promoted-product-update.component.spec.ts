/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { PromotedProductUpdateComponent } from 'app/entities/promoted-product/promoted-product-update.component';
import { PromotedProductService } from 'app/entities/promoted-product/promoted-product.service';
import { PromotedProduct } from 'app/shared/model/promoted-product.model';

describe('Component Tests', () => {
    describe('PromotedProduct Management Update Component', () => {
        let comp: PromotedProductUpdateComponent;
        let fixture: ComponentFixture<PromotedProductUpdateComponent>;
        let service: PromotedProductService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [PromotedProductUpdateComponent]
            })
                .overrideTemplate(PromotedProductUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PromotedProductUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PromotedProductService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PromotedProduct('123');
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.promotedProduct = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PromotedProduct();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.promotedProduct = entity;
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
