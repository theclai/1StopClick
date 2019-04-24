import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';
import { IUser } from 'app/core/user/user.model';

export interface IProductReview {
    id?: string;
    rating?: number;
    date?: Moment;
    ipAddress?: string;
    review?: string;
    product?: IProduct;
    user?: IUser;
}

export class ProductReview implements IProductReview {
    constructor(
        public id?: string,
        public rating?: number,
        public date?: Moment,
        public ipAddress?: string,
        public review?: string,
        public product?: IProduct,
        public user?: IUser
    ) {}
}
