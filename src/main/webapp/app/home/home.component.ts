import { Account } from './../core/user/account.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiParseLinks } from 'ng-jhipster';

import { LoginModalService, AccountService } from 'app/core';
import { HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { Subscription } from 'rxjs';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;
    categories: ICategory[];
    category: any;
    page: any;
    itemsPerPage: any;
    links: any;
    totalItems: number;
    predicate: string;
    reverse: any;
    categorySubscription: Subscription;
    productSubscription: Subscription;
    product: IProduct[];
    filteredProduct: IProduct[];
    searchedProduct: IProduct[];
    filter: string;
    searchValue: any;

    constructor(
        private accountService: AccountService,
        protected categoryService: CategoryService,
        protected productService: ProductService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService,
        private router: ActivatedRoute,
        private route: Router
    ) {
        this.searchValue = null;
        this.categories = [];
        this.product = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.predicate = 'id';
        this.reverse = true;
    }

    ngOnInit() {
        this.category = this.router.snapshot.queryParamMap.get('category');
        this.loadAll();
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    ngOnDestroy() {
        if (this.categorySubscription) {
            this.categorySubscription.unsubscribe();
        }
        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    protected loadAll() {
        this.categorySubscription = this.categoryService
            .query({
                page: this.page,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ICategory[]>) => this.paginateCategories(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );

        this.productSubscription = this.productService
            .query()
            .pipe(
                switchMap((res: HttpResponse<IProduct[]>) => {
                    this.paginateProducts(res.body, res.headers);
                    return this.router.queryParamMap;
                })
            )
            .subscribe(param => {
                this.filter = param.get('category');
                if (this.filter) {
                    this.applyCategoryFilter();
                } else {
                    this.filteredProduct = this.product;
                }
                if (this.searchValue) {
                    this.applySearchFilter();
                }
            });
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    protected paginateCategories(data: ICategory[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        for (let i = 0; i < data.length; i++) {
            this.categories.push(data[i]);
        }
    }
    protected paginateProducts(data: IProduct[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        for (let i = 0; i < data.length; i++) {
            this.product.push(data[i]);
        }
        this.filteredProduct = this.product;
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    currentCategory(data) {
        this.category = data;
    }

    searchProduct(query: any) {
        if (this.filter !== null) {
            this.applyCategoryFilter();
            if (query.value.trim() !== '') {
                this.searchValue = query.value;
                this.applySearchFilter();
            }
        } else {
            if (query.value.trim() !== '') {
                this.searchValue = query.value;
                this.applySearchFilter();
            }
        }
        query.value = '';
        console.log('filtered product>>>>', this.filteredProduct);
    }

    resetSearch() {
        if (this.filter) {
            this.applyCategoryFilter();
        } else {
            this.filteredProduct = this.product;
        }
        this.searchValue = null;
    }

    protected applyCategoryFilter() {
        this.filteredProduct = this.product.filter(p => p.category.categoryName.toLowerCase().includes(this.filter.toLowerCase()));
    }
    protected applySearchFilter() {
        // comes second if both filter are applied
        this.searchedProduct = this.filteredProduct.filter(p => p.productName.toLowerCase().includes(this.searchValue.toLowerCase()));
        this.filteredProduct = this.searchedProduct;
    }

    productDetail(productID) {
        this.route.navigate(['product-info', productID]);
    }
}
