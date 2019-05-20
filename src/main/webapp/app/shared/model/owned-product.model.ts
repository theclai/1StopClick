import { IUser } from 'app/core/user/user.model';
import { IProduct } from 'app/shared/model/product.model';

export interface IOwnedProduct {
    id?: string;
    user?: IUser;
    products?: IProduct[];
}

export class OwnedProduct implements IOwnedProduct {
    constructor(public id?: string, public user?: IUser, public products?: IProduct[]) {}
}
