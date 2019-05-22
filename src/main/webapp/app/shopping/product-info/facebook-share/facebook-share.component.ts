import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
    selector: 'jhi-facebook-share',
    template: `
        <div
            class="fb-like"
            [attr.data-href]="url"
            data-layout="button_count"
            data-action="like"
            data-show-faces="true"
            data-share="true"
        ></div>
    `,
    styles: []
})
export class FacebookShareComponent implements AfterViewInit {
    @Input() url = location.href;
    constructor() {
        // for testing in localhost
        // this.url = 'http://ec2-18-136-126-56.ap-southeast-1.compute.amazonaws.com/#/product-info/5cbe7623a8dd0c126f92cd9f';

        // initialise facebook sdk after it loads if required
        if (!window['fbAsyncInit']) {
            window['fbAsyncInit'] = function() {
                window['FB'].init({
                    appId: 'your-app-id',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v3.0'
                });
            };
        }

        // load facebook sdk if required
        const url = 'https://connect.facebook.net/en_US/sdk.js';
        if (!document.querySelector(`script[src='${url}']`)) {
            const script = document.createElement('script');
            script.src = url;
            document.body.appendChild(script);
        }
    }

    ngAfterViewInit(): void {
        // render facebook button
        // tslint:disable-next-line: no-unused-expression
        window['FB'] && window['FB'].XFBML.parse();
    }
}
