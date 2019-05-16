/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AppTestModule } from '../../../test.module';
import { PromotedProductDeleteDialogComponent } from 'app/entities/promoted-product/promoted-product-delete-dialog.component';
import { PromotedProductService } from 'app/entities/promoted-product/promoted-product.service';

describe('Component Tests', () => {
    describe('PromotedProduct Management Delete Component', () => {
        let comp: PromotedProductDeleteDialogComponent;
        let fixture: ComponentFixture<PromotedProductDeleteDialogComponent>;
        let service: PromotedProductService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [PromotedProductDeleteDialogComponent]
            })
                .overrideTemplate(PromotedProductDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PromotedProductDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PromotedProductService);
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
