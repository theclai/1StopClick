import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPromotedProduct } from 'app/shared/model/promoted-product.model';

type EntityResponseType = HttpResponse<IPromotedProduct>;
type EntityArrayResponseType = HttpResponse<IPromotedProduct[]>;

@Injectable({ providedIn: 'root' })
export class PromotedProductService {
    public resourceUrl = SERVER_API_URL + 'api/promoted-products';

    constructor(protected http: HttpClient) {}

    create(promotedProduct: IPromotedProduct): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(promotedProduct);
        return this.http
            .post<IPromotedProduct>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(promotedProduct: IPromotedProduct): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(promotedProduct);
        return this.http
            .put<IPromotedProduct>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http
            .get<IPromotedProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPromotedProduct[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(promotedProduct: IPromotedProduct): IPromotedProduct {
        const copy: IPromotedProduct = Object.assign({}, promotedProduct, {
            createdDate:
                promotedProduct.createdDate != null && promotedProduct.createdDate.isValid()
                    ? promotedProduct.createdDate.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.createdDate = res.body.createdDate != null ? moment(res.body.createdDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((promotedProduct: IPromotedProduct) => {
                promotedProduct.createdDate = promotedProduct.createdDate != null ? moment(promotedProduct.createdDate) : null;
            });
        }
        return res;
    }
}
