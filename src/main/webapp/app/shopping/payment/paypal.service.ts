import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_API_URL } from 'app/app.constants';

@Injectable({
    providedIn: 'root'
})
export class PaypalService {
    urlCreatepayment = SERVER_API_URL + 'api/paypal/make/payment';
    urlCompletePayment = SERVER_API_URL + 'api/paypal/complete/payment';

    constructor(private http: HttpClient) {}

    makePayment(sum, currentOrigin, currentUrl) {
        return this.http.post(this.urlCreatepayment + '?sum=' + sum + '&currentOrigin=' + currentOrigin + '&returnUrl=' + currentUrl, {});
    }

    completePayment(paymentId: string, payerId: string) {
        return this.http.post(this.urlCompletePayment + '?paymentId=' + paymentId + '&payerId=' + payerId, {});
    }
}
