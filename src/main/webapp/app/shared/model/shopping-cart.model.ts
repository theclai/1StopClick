import { Moment } from 'moment';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { IUser } from 'app/core/user/user.model';

export interface IShoppingCart {
    id?: string;
    date?: Moment;
    orderItems?: IOrderItem[];
    user?: IUser;
}

export class ShoppingCart implements IShoppingCart {
    constructor(public id?: string, public date?: Moment, public orderItems?: IOrderItem[], public user?: IUser) {}
}
