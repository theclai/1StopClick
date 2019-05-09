import { Account } from 'app/core/user/account.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService, JhiEventManager } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { VERSION } from 'app/app.constants';
import { JhiLanguageHelper, AccountService, LoginModalService, LoginService } from 'app/core';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { ShoppingCartService, ShoppingCartComponent } from 'app/entities/shopping-cart';
import { IOrderItem } from 'app/shared/model/order-item.model';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    account: Account;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    loggedIn: boolean;
    shoppingCart$: any;
    orderItem: any;
    totalItem: any;
    quantity: number;

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private sessionStorage: SessionStorageService,
        private accountService: AccountService,
        private eventManager: JhiEventManager,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private shoppingCartService: ShoppingCartService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
        this.orderItem = [];
    }

    async ngOnInit() {
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        const cartId = localStorage.getItem('cartId');
        if (cartId) {
            /* await this.shoppingCartService.find(cartId).subscribe((res: HttpResponse<IShoppingCart>) => {
                this.shoppingCart(res.body.orderItems);
                console.log('order item >>>>' , this.orderItem);
            }); */
        } else {
            /*             this.quantity = 0;
             */
        }
    }
    getTotalQuantity() {
        this.totalItem = this.orderItem.map(t => t.quantity);
        let itemCount = 0;
        for (let id = 0; id < this.totalItem.length; id++) {
            itemCount += this.totalItem[id];
        }
        this.quantity = itemCount;
    }
    shoppingCart(data: IOrderItem[]) {
        for (let i = 0; i < data.length; i++) {
            this.orderItem.push(data[i]);
        }
    }

    changeLanguage(languageKey: string) {
        this.sessionStorage.store('locale', languageKey);
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }
}
