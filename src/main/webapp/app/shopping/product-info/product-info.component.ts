import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/entities/product';
import { Subscription } from 'rxjs';
import { IProduct } from 'app/shared/model/product.model';
import { HttpResponse, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'jhi-product-info',
    templateUrl: './product-info.component.html',
    styles: []
})
export class ProductInfoComponent implements OnInit, OnDestroy {
    productID: any;
    product: IProduct[];
    productSubscription: Subscription;
    constructor(private router: ActivatedRoute, private productService: ProductService) {
        this.product = [];
    }

    ngOnInit() {
        this.productID = this.router.snapshot.paramMap.get('id');
        this.loadProduct(this.productID);
        console.log(this.product);
    }

    ngOnDestroy() {
        if (this.productSubscription) {
            this.productSubscription.unsubscribe();
        }
    }

    protected loadProduct(productId: string) {
        this.productSubscription = this.productService.find(productId).subscribe((res: HttpResponse<IProduct>) => {
            this.product.push(res.body);
        });
    }
}
