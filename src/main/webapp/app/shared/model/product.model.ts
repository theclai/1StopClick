import { ICategory } from 'app/shared/model/category.model';
import { IProductDiscount } from 'app/shared/model/product-discount.model';

export interface IProduct {
    id?: string;
    productName?: string;
    price?: number;
    imageUrl?: string;
    category?: ICategory;
    productDiscount?: IProductDiscount;
}

export class Product implements IProduct {
    constructor(
        public id?: string,
        public productName?: string,
        public price?: number,
        public imageUrl?: string,
        public category?: ICategory,
        public productDiscount?: IProductDiscount
    ) {}
}
