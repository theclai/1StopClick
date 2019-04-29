import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductDiscount } from 'app/shared/model/product-discount.model';

type EntityResponseType = HttpResponse<IProductDiscount>;
type EntityArrayResponseType = HttpResponse<IProductDiscount[]>;

@Injectable({ providedIn: 'root' })
export class ProductDiscountService {
    public resourceUrl = SERVER_API_URL + 'api/product-discounts';

    constructor(protected http: HttpClient) {}

    create(productDiscount: IProductDiscount): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productDiscount);
        return this.http
            .post<IProductDiscount>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(productDiscount: IProductDiscount): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productDiscount);
        return this.http
            .put<IProductDiscount>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http
            .get<IProductDiscount>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProductDiscount[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(productDiscount: IProductDiscount): IProductDiscount {
        const copy: IProductDiscount = Object.assign({}, productDiscount, {
            date: productDiscount.date != null && productDiscount.date.isValid() ? productDiscount.date.toJSON() : null
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
            res.body.forEach((productDiscount: IProductDiscount) => {
                productDiscount.date = productDiscount.date != null ? moment(productDiscount.date) : null;
            });
        }
        return res;
    }
}
