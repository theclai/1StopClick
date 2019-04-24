/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AppTestModule } from '../../../test.module';
import { ShoppingCartDeleteDialogComponent } from 'app/entities/shopping-cart/shopping-cart-delete-dialog.component';
import { ShoppingCartService } from 'app/entities/shopping-cart/shopping-cart.service';

describe('Component Tests', () => {
    describe('ShoppingCart Management Delete Component', () => {
        let comp: ShoppingCartDeleteDialogComponent;
        let fixture: ComponentFixture<ShoppingCartDeleteDialogComponent>;
        let service: ShoppingCartService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AppTestModule],
                declarations: [ShoppingCartDeleteDialogComponent]
            })
                .overrideTemplate(ShoppingCartDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ShoppingCartDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShoppingCartService);
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
