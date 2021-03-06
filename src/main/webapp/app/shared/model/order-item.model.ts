import { IProduct } from 'app/shared/model/product.model';
import { IProductOrder } from 'app/shared/model/product-order.model';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';

export const enum OrderItemStatus {
    AVAILABLE = 'AVAILABLE',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    BACK_ORDER = 'BACK_ORDER'
}

export interface IOrderItem {
    id?: string;
    quantity?: number;
    totalPrice?: number;
    status?: OrderItemStatus;
    product?: IProduct;
    productOrder?: IProductOrder;
    shoppingCart?: IShoppingCart;
}

export class OrderItem implements IOrderItem {
    constructor(
        public id?: string,
        public quantity?: number,
        public totalPrice?: number,
        public status?: OrderItemStatus,
        public product?: IProduct,
        public productOrder?: IProductOrder,
        public shoppingCart?: IShoppingCart
    ) {}
}
