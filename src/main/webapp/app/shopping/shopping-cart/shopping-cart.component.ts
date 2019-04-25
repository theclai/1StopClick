import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'app/entities/shopping-cart';

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
