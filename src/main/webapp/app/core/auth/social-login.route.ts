import { HomeComponent } from './../../home/home.component';
import { Route } from '@angular/router';
import { OAuth2RedirectHandler } from './oauth2-redirect.handler';

export const socialLoginRoute: Route = {
    path: 'oauth2/redirect',
    component: OAuth2RedirectHandler
};
