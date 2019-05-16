import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPromotedProduct } from 'app/shared/model/promoted-product.model';
import { PromotedProductService } from './promoted-product.service';

@Component({
    selector: 'jhi-promoted-product-delete-dialog',
    templateUrl: './promoted-product-delete-dialog.component.html'
})
export class PromotedProductDeleteDialogComponent {
    promotedProduct: IPromotedProduct;

    constructor(
        protected promotedProductService: PromotedProductService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.promotedProductService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'promotedProductListModification',
                content: 'Deleted an promotedProduct'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-promoted-product-delete-popup',
    template: ''
})
export class PromotedProductDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ promotedProduct }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PromotedProductDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.promotedProduct = promotedProduct;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/promoted-product', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/promoted-product', { outlets: { popup: null } }]);
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
