import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IShoppingCart } from 'app/shared/model/shopping-cart.model';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
    selector: 'jhi-shopping-cart-delete-dialog',
    templateUrl: './shopping-cart-delete-dialog.component.html'
})
export class ShoppingCartDeleteDialogComponent {
    shoppingCart: IShoppingCart;

    constructor(
        protected shoppingCartService: ShoppingCartService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.shoppingCartService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'shoppingCartListModification',
                content: 'Deleted an shoppingCart'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shopping-cart-delete-popup',
    template: ''
})
export class ShoppingCartDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ shoppingCart }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ShoppingCartDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.shoppingCart = shoppingCart;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/shopping-cart', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/shopping-cart', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
