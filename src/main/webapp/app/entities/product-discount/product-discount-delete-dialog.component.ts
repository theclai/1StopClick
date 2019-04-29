import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductDiscount } from 'app/shared/model/product-discount.model';
import { ProductDiscountService } from './product-discount.service';

@Component({
    selector: 'jhi-product-discount-delete-dialog',
    templateUrl: './product-discount-delete-dialog.component.html'
})
export class ProductDiscountDeleteDialogComponent {
    productDiscount: IProductDiscount;

    constructor(
        protected productDiscountService: ProductDiscountService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.productDiscountService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productDiscountListModification',
                content: 'Deleted an productDiscount'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-discount-delete-popup',
    template: ''
})
export class ProductDiscountDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productDiscount }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductDiscountDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productDiscount = productDiscount;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-discount', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-discount', { outlets: { popup: null } }]);
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
