import { ShoppingCartService } from './../../shared/services/shopping-cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'jhi-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styles: []
})
export class ShoppingCartComponent implements OnInit {
    constructor(private shoppingCartService: ShoppingCartService) {}

    ngOnInit() {
        this.shoppingCartService.getData();
    }
}
