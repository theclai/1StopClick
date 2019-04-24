import { Moment } from 'moment';
import { IOrderItem } from 'app/shared/model/order-item.model';

export interface IShoppingCart {
    id?: string;
    date?: Moment;
    orderItems?: IOrderItem[];
}

export class ShoppingCart implements IShoppingCart {
    constructor(public id?: string, public date?: Moment, public orderItems?: IOrderItem[]) {}
}
