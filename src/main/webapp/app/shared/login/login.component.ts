import { IShoppingCart } from './../model/shopping-cart.model';
import { ShoppingCartService } from './../../entities/shopping-cart/shopping-cart.service';
import { Component, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL } from 'app/app.constants';
import { LoginService } from 'app/core/login/login.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-login-modal',
    templateUrl: './login.component.html',
    styleUrls: ['login.scss']
})
export class JhiLoginModalComponent implements AfterViewInit {
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;
    public GOOGLE_AUTH_URL = GOOGLE_AUTH_URL;
    public FACEBOOK_AUTH_URL = FACEBOOK_AUTH_URL;
    shoppingCart: IShoppingCart[];
    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private router: Router,
        public activeModal: NgbActiveModal,
        private shoppingCartService: ShoppingCartService
    ) {
        this.credentials = {};
        this.shoppingCart = [];
    }

    ngAfterViewInit() {
        setTimeout(() => this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []), 0);
    }

    cancel() {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
        this.activeModal.dismiss('cancel');
    }

    login() {
        this.loginService
            .login({
                username: this.username,
                password: this.password,
                rememberMe: this.rememberMe
            })
            .then(() => {
                this.authenticationError = false;
                this.activeModal.dismiss('login success');
                if (this.router.url === '/register' || /^\/activate\//.test(this.router.url) || /^\/reset\//.test(this.router.url)) {
                    this.router.navigate(['']);
                }

                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Authentication Success'
                });

                // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // since login is successful, go to stored previousState and clear previousState
                const redirect = this.stateStorageService.getUrl();
                if (redirect) {
                    this.stateStorageService.storeUrl(null);
                    this.router.navigate([redirect]);
                }
                if (redirect == null) {
                    this.router.navigate(['']);
                }
                this.shoppingCartService.query({}).subscribe((res: HttpResponse<IShoppingCart[]>) => this.getShoppingCart(res.body));
            })
            .catch(() => {
                this.authenticationError = true;
            });
    }
    getShoppingCart(body: IShoppingCart[]): void {
        for (let i = 0; i < body.length; i++) {
            this.shoppingCart.push(body[i]);
        }
        const cartExist = this.shoppingCart.find(data => data.user.login === this.username);
        if (cartExist) {
            localStorage.setItem('cartId', cartExist.id);
        }
    }

    register() {
        this.activeModal.dismiss('to state register');
        this.router.navigate(['/register']);
    }

    requestResetPassword() {
        this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }

    loginWithFacebook() {
        console.log('login with facebook');
    }

    loginWithGoogle() {
        console.log('login with Google');
    }
}
