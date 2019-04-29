import { Moment } from 'moment';
import { IProduct } from 'app/shared/model/product.model';

export interface IProductDiscount {
    id?: string;
    discountValue?: number;
    discountUnit?: string;
    date?: Moment;
    voucherCode?: string;
    minimumOrderValue?: number;
    maximumDiscountValue?: number;
    isRedemAllowed?: boolean;
    products?: IProduct[];
}

export class ProductDiscount implements IProductDiscount {
    constructor(
        public id?: string,
        public discountValue?: number,
        public discountUnit?: string,
        public date?: Moment,
        public voucherCode?: string,
        public minimumOrderValue?: number,
        public maximumDiscountValue?: number,
        public isRedemAllowed?: boolean,
        public products?: IProduct[]
    ) {
        this.isRedemAllowed = this.isRedemAllowed || false;
    }
}
