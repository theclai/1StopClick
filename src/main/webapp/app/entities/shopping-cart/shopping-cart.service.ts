import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IShoppingCart } from 'app/shared/model/shopping-cart.model';

type EntityResponseType = HttpResponse<IShoppingCart>;
type EntityArrayResponseType = HttpResponse<IShoppingCart[]>;

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
    public resourceUrl = SERVER_API_URL + 'api/shopping-carts';

    constructor(protected http: HttpClient) {}

    create(shoppingCart: IShoppingCart): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(shoppingCart);
        return this.http
            .post<IShoppingCart>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(shoppingCart: IShoppingCart): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(shoppingCart);
        return this.http
            .put<IShoppingCart>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http
            .get<IShoppingCart>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IShoppingCart[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(shoppingCart: IShoppingCart): IShoppingCart {
        const copy: IShoppingCart = Object.assign({}, shoppingCart, {
            date: shoppingCart.date != null && shoppingCart.date.isValid() ? shoppingCart.date.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((shoppingCart: IShoppingCart) => {
                shoppingCart.date = shoppingCart.date != null ? moment(shoppingCart.date) : null;
            });
        }
        return res;
    }
}
