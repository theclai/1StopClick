import { Moment } from 'moment';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { IInvoice } from 'app/shared/model/invoice.model';
import { IUser } from 'app/core/user/user.model';

export const enum Orderstatus {
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED'
}

export interface IProductOrder {
    id?: string;
    placeDate?: Moment;
    status?: Orderstatus;
    code?: string;
    orderItems?: IOrderItem[];
    invoices?: IInvoice[];
    users?: IUser[];
}

export class ProductOrder implements IProductOrder {
    constructor(
        public id?: string,
        public placeDate?: Moment,
        public status?: Orderstatus,
        public code?: string,
        public orderItems?: IOrderItem[],
        public invoices?: IInvoice[],
        public users?: IUser[]
    ) {}
}
