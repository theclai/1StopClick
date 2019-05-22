import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'jhi-linked-in-share',
    template: `
        <div #element></div>
    `,
    styles: []
})
export class LinkedInShareComponent implements AfterViewInit {
    @Input() url = location.href;
    @ViewChild('element') element: ElementRef;

    constructor() {
        // load twitter sdk if required
        const url = 'https://platform.linkedin.com/in.js';
        if (!document.querySelector(`script[src='${url}']`)) {
            const script = document.createElement('script');
            script.src = url;
            script.innerHTML = ' lang: en_US';
            document.body.appendChild(script);
        }
    }

    ngAfterViewInit(): void {
        // add linkedin share button script tag to element
        this.element.nativeElement.innerHTML = `<script type="IN/Share" data-url="${this.url}"></script>`;

        // render share button
        // tslint:disable-next-line: no-unused-expression
        window['IN'] && window['IN'].parse();
    }
}
