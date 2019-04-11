import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Injectable, OnInit, Component } from '@angular/core';
import { isClassImplements } from '@babel/types';

@Component({
    template: '<div></div>'
})
// tslint:disable-next-line:component-class-suffix
export class OAuth2RedirectHandler implements OnInit {
    token: string;
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            console.log('OAuth2RedirectHandler --> token', this.token);
            this.$localStorage.store('authenticationToken', this.token);
            this.router.navigate(['/']);
        });
    }
    constructor(
        private authServerProvider: AuthServerProvider,
        private $localStorage: LocalStorageService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    // getUrlParameter(name) {
    //     name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    //     const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

    //     const results = regex.exec(this.props.location.search);
    //     return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    // };
}
