import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';
import { JhiParseLinks } from 'ng-jhipster';

@Component({
    selector: 'jhi-category-update',
    templateUrl: './category-update.component.html'
})
export class CategoryUpdateComponent implements OnInit {
    category: ICategory;
    isSaving: boolean;
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    reverse: any;
    totalItems: number;
    categories: ICategory[];
    isExists: boolean;

    constructor(protected categoryService: CategoryService, protected activatedRoute: ActivatedRoute, protected parseLinks: JhiParseLinks) {
        this.isExists = false;
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ category }) => {
            this.category = category;
        });
        this.categories = [];
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.checkExistingCategoryName();
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>) {
        result.subscribe((res: HttpResponse<ICategory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected async checkExistingCategoryName() {
        await this.categoryService.query().subscribe((res: HttpResponse<ICategory[]>) => this.paginateCategories(res.body));
    }

    protected paginateCategories(data: ICategory[]) {
        for (let i = 0; i < data.length; i++) {
            this.categories.push(data[i]);
        }
        const exist = this.categories.find(x => x.categoryName.toLowerCase() === this.category.categoryName.toLowerCase());
        if (exist === undefined) {
            this.isExists = false;
        } else {
            this.isExists = true;
        }
        if (!this.isExists) {
            if (this.category.id !== undefined) {
                this.subscribeToSaveResponse(this.categoryService.update(this.category));
            } else {
                this.subscribeToSaveResponse(this.categoryService.create(this.category));
            }
        }

        setTimeout(() => {
            this.isExists = false;
            this.isSaving = false;
        }, 2000);
    }
}
