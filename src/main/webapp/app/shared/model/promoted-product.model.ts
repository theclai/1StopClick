import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';

export const enum PromotedStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED'
}

export interface IPromotedProduct {
    id?: string;
    createdDate?: Moment;
    duration?: number;
    status?: PromotedStatus;
    promotedProduct?: IProduct;
}

export class PromotedProduct implements IPromotedProduct {
    constructor(
        public id?: string,
        public createdDate?: Moment,
        public duration?: number,
        public status?: PromotedStatus,
        public promotedProduct?: IProduct
    ) {}
}
