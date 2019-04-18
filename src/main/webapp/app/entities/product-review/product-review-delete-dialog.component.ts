import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductReview } from 'app/shared/model/product-review.model';
import { ProductReviewService } from './product-review.service';

@Component({
    selector: 'jhi-product-review-delete-dialog',
    templateUrl: './product-review-delete-dialog.component.html'
})
export class ProductReviewDeleteDialogComponent {
    productReview: IProductReview;

    constructor(
        protected productReviewService: ProductReviewService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.productReviewService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productReviewListModification',
                content: 'Deleted an productReview'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-review-delete-popup',
    template: ''
})
export class ProductReviewDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productReview }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductReviewDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productReview = productReview;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-review', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-review', { outlets: { popup: null } }]);
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
