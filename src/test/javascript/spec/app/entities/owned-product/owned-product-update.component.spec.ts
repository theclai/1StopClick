/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AppTestModule } from '../../../test.module';
import { OwnedProductUpdateComponent } from 'app/entities/owned-product/owned-product-update.component';
import { OwnedProductService } from 'app/entities/owned-product/owned-product.service';
import { OwnedProduct } from 'app/shared/model/owned-product.model';

describe('Component Tests', () => {
    describe('OwnedProduct Management Update Component', () => {
        let comp: OwnedProductUpdateComponent;
        let fixture: ComponentFixture<OwnedProductUpdateComponent>;
        let service: OwnedProductService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [OwnedProductUpdateComponent]
            })
                .overrideTemplate(OwnedProductUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(OwnedProductUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OwnedProductService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new OwnedProduct('123');
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.ownedProduct = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new OwnedProduct();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.ownedProduct = entity;
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
