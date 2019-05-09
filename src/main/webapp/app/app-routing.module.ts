import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute, navbarRoute } from './layouts';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { socialLoginRoute } from './core/auth/social-login.route';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute, socialLoginRoute];

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'admin',
                    loadChildren: './admin/admin.module#AppAdminModule'
                },
                ...LAYOUT_ROUTES
            ],
            { useHash: true, enableTracing: false /* DEBUG_INFO_ENABLED */ }
        )
    ],
    exports: [RouterModule]
})
export class AppAppRoutingModule {}
