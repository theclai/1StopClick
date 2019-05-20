import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IOwnedProduct } from 'app/shared/model/owned-product.model';

type EntityResponseType = HttpResponse<IOwnedProduct>;
type EntityArrayResponseType = HttpResponse<IOwnedProduct[]>;

@Injectable({ providedIn: 'root' })
export class OwnedProductService {
    public resourceUrl = SERVER_API_URL + 'api/owned-products';

    constructor(protected http: HttpClient) {}

    create(ownedProduct: IOwnedProduct): Observable<EntityResponseType> {
        return this.http.post<IOwnedProduct>(this.resourceUrl, ownedProduct, { observe: 'response' });
    }

    update(ownedProduct: IOwnedProduct): Observable<EntityResponseType> {
        return this.http.put<IOwnedProduct>(this.resourceUrl, ownedProduct, { observe: 'response' });
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http.get<IOwnedProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IOwnedProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
