import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOwnedProduct } from 'app/shared/model/owned-product.model';
import { OwnedProductService } from './owned-product.service';

@Component({
    selector: 'jhi-owned-product-delete-dialog',
    templateUrl: './owned-product-delete-dialog.component.html'
})
export class OwnedProductDeleteDialogComponent {
    ownedProduct: IOwnedProduct;

    constructor(
        protected ownedProductService: OwnedProductService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.ownedProductService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'ownedProductListModification',
                content: 'Deleted an ownedProduct'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-owned-product-delete-popup',
    template: ''
})
export class OwnedProductDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ ownedProduct }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(OwnedProductDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.ownedProduct = ownedProduct;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/owned-product', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/owned-product', { outlets: { popup: null } }]);
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
