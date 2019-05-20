import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUser, AccountService } from 'app/core';
import { OwnedProduct, IOwnedProduct } from 'app/shared/model/owned-product.model';
import { OwnedProductService } from 'app/entities/owned-product';
import { HttpResponse } from '@angular/common/http';
import { IProduct } from 'app/shared/model/product.model';

@Component({
    selector: 'jhi-my-products',
    templateUrl: './my-products.component.html',
    styles: []
})
export class MyProductsComponent implements OnInit, OnDestroy {
    isEmpty = true;
    account: Account;
    user: IUser;
    quantity: number;
    ownedProductSubs: Subscription;
    ownedProduct: IOwnedProduct[];
    products: IProduct[];

    constructor(private accountService: AccountService, private ownedProductService: OwnedProductService) {
        this.user = {};
        this.ownedProduct = [];
        this.products = [];
    }

    ngOnDestroy() {
        if (this.ownedProductSubs) {
            this.ownedProductSubs.unsubscribe();
        }
    }
    async ngOnInit() {
        this.account = await this.accountService.identity().then((account: Account) => {
            this.setAccount(account);
            return (this.account = account);
        });
        setTimeout(() => {
            this.ownedProductSubs = this.ownedProductService
                .query()
                .subscribe((res: HttpResponse<IOwnedProduct[]>) => this.generateOwnedProduct(res.body));
        }, 200);
    }
    generateOwnedProduct(data: IOwnedProduct[]): void {
        for (let i = 0; i < data.length; i++) {
            this.ownedProduct.push(data[i]);
        }
        this.ownedProduct = this.ownedProduct.filter(x => x.user.id === this.user.id);
        const own1 = this.ownedProduct[0];
        this.products = own1.products;
        this.getQuantity();
        console.log(this.products);
    }
    protected getQuantity() {
        this.quantity = this.products.length;
        if (this.quantity === 0) {
            this.isEmpty = true;
        } else {
            this.isEmpty = false;
        }
    }

    setAccount(account: any) {
        if (!(account === null)) {
            this.user.login = account.login;
            this.user.email = account.email;
            this.user.id = account.id;
        }
    }
}
