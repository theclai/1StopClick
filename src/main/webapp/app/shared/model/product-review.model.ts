import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';

export interface IProductReview {
    id?: string;
    rating?: number;
    date?: Moment;
    ipAddress?: string;
    product?: IProduct;
}

export class ProductReview implements IProductReview {
    constructor(public id?: string, public rating?: number, public date?: Moment, public ipAddress?: string, public product?: IProduct) {}
}
