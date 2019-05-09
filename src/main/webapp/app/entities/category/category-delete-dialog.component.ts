import { ProductService } from 'app/entities/product/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';
import { IProduct } from 'app/shared/model/product.model';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-category-delete-dialog',
    templateUrl: './category-delete-dialog.component.html'
})
export class CategoryDeleteDialogComponent {
    category: ICategory;
    product: IProduct[];
    isCategoryExist: IProduct;
    errorDelete: boolean;

    constructor(
        protected categoryService: CategoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager,
        private productService: ProductService
    ) {
        this.product = [];
        this.errorDelete = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    async confirmDelete(id: string) {
        await this.productService.query().subscribe((res: HttpResponse<IProduct[]>) => {
            for (let i = 0; i < res.body.length; i++) {
                this.product.push(res.body[i]);
            }
            this.isCategoryExist = this.product.find(data => data.category.id === id);
            this.checkCategory(this.isCategoryExist, id);
        });
    }
    checkCategory(isCategoryExist: IProduct, id: string) {
        if (!isCategoryExist) {
            this.categoryService.delete(id).subscribe(response => {
                this.eventManager.broadcast({
                    name: 'categoryListModification',
                    content: 'Deleted an category'
                });
                this.activeModal.dismiss(true);
            });
        } else {
            this.errorDelete = true;
            setTimeout(() => {
                this.errorDelete = false;
            }, 5000);
        }
    }
}

@Component({
    selector: 'jhi-category-delete-popup',
    template: ''
})
export class CategoryDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ category }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CategoryDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.category = category;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/category', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/category', { outlets: { popup: null } }]);
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
