import { ICategory } from 'app/shared/model/category.model';

export interface IProduct {
    id?: string;
    productName?: string;
    price?: number;
    imageUrl?: string;
    category?: ICategory;
}

export class Product implements IProduct {
    constructor(
        public id?: string,
        public productName?: string,
        public price?: number,
        public imageUrl?: string,
        public category?: ICategory
    ) {}
}
