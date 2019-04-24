import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductOrder } from 'app/shared/model/product-order.model';

type EntityResponseType = HttpResponse<IProductOrder>;
type EntityArrayResponseType = HttpResponse<IProductOrder[]>;

@Injectable({ providedIn: 'root' })
export class ProductOrderService {
    public resourceUrl = SERVER_API_URL + 'api/product-orders';

    constructor(protected http: HttpClient) {}

    create(productOrder: IProductOrder): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productOrder);
        return this.http
            .post<IProductOrder>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(productOrder: IProductOrder): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productOrder);
        return this.http
            .put<IProductOrder>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http
            .get<IProductOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProductOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(productOrder: IProductOrder): IProductOrder {
        const copy: IProductOrder = Object.assign({}, productOrder, {
            placeDate: productOrder.placeDate != null && productOrder.placeDate.isValid() ? productOrder.placeDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.placeDate = res.body.placeDate != null ? moment(res.body.placeDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((productOrder: IProductOrder) => {
                productOrder.placeDate = productOrder.placeDate != null ? moment(productOrder.placeDate) : null;
            });
        }
        return res;
    }
}
