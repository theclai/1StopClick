/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AppTestModule } from '../../../test.module';
import { OwnedProductDeleteDialogComponent } from 'app/entities/owned-product/owned-product-delete-dialog.component';
import { OwnedProductService } from 'app/entities/owned-product/owned-product.service';

describe('Component Tests', () => {
    describe('OwnedProduct Management Delete Component', () => {
        let comp: OwnedProductDeleteDialogComponent;
        let fixture: ComponentFixture<OwnedProductDeleteDialogComponent>;
        let service: OwnedProductService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [OwnedProductDeleteDialogComponent]
            })
                .overrideTemplate(OwnedProductDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OwnedProductDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OwnedProductService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete('123');
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith('123');
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
