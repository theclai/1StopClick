import { Subscription } from 'rxjs';
import { ProductOrderService } from 'app/entities/product-order/product-order.service';
import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { IUser } from 'app/core';
import { IProductOrder, Orderstatus } from 'app/shared/model/product-order.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { InvoiceService } from 'app/entities/invoice';
import { IInvoice } from 'app/shared/model/invoice.model';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DetailModalService } from './detail-modal.service';

@Component({
    selector: 'jhi-my-orders',
    templateUrl: './my-orders.component.html',
    styles: []
})
export class MyOrdersComponent implements OnInit, OnDestroy {
    isEmpty = true;
    account: Account;
    user: IUser;
    productOrder: IProductOrder[];
    modalRef: NgbModalRef;
    currentArray: IUser;
    quantity: number;
    productOrderSubscription: Subscription;
    invoice: IInvoice[];
    selectedStatus = 'ALL';
    status: any[];
    filteredProductOrder: IProductOrder[];
    statusCaption = '';
    constructor(
        private accountService: AccountService,
        private productOrderService: ProductOrderService,
        private route: Router,
        private invoiceService: InvoiceService,
        private detailModalService: DetailModalService
    ) {
        this.productOrder = [];
        this.filteredProductOrder = [];
        this.user = {};
        this.invoice = [];
        this.status = ['ALL', Orderstatus.COMPLETED, Orderstatus.PENDING, Orderstatus.CANCELLED];
    }

    ngOnDestroy() {
        if (this.productOrderSubscription) {
            this.productOrderSubscription.unsubscribe();
        }
    }
    async ngOnInit() {
        this.account = await this.accountService.identity().then((account: Account) => {
            this.setAccount(account);
            return (this.account = account);
        });
        setTimeout(() => {
            this.productOrderSubscription = this.productOrderService
                .query()
                .subscribe((res: HttpResponse<IProductOrder[]>) => this.generateProductOrder(res.body));
        }, 200);
    }
    generateProductOrder(data: IProductOrder[]) {
        for (let j = 0; j < data.length; j++) {
            const temp = data[j].users;
            if (temp.find(x => x.id === this.user.id)) {
                this.productOrder.push(data[j]);
            }
        }
        this.filteredProductOrder = this.productOrder;
        this.getQuantity();
        this.setStatusCaption();
    }
    protected getQuantity() {
        this.quantity = this.filteredProductOrder.length;
        if (this.quantity === 0 && (this.selectedStatus === 'ALL' || this.selectedStatus === null)) {
            this.isEmpty = true;
        } else {
            this.isEmpty = false;
        }
    }
    setAccount(account: any) {
        if (!(account === null)) {
            this.user.login = account.login;
            this.user.email = account.email;
            this.user.id = account.id;
        }
    }
    async redirectToPayment(productOderId: string) {
        await this.invoiceService.query().subscribe((res: HttpResponse<IInvoice[]>) => {
            this.invoice = res.body.filter(y => y.productOrder.id === productOderId);
            const invoiceID = this.invoice[0].id;
            this.route.navigate(['checkout/payment', invoiceID]);
        });
    }
    async redirectToInvoice(productOrderID: string) {
        await this.invoiceService.query().subscribe((res: HttpResponse<IInvoice[]>) => {
            this.invoice = res.body.filter(y => y.productOrder.id === productOrderID);
            const invoiceID = this.invoice[0].id;
            this.route.navigate(['checkout/purchase-confirmation', invoiceID]);
        });
    }

    viewDetail(productOrderId: string) {
        this.modalRef = this.detailModalService.open();
        this.modalRef.componentInstance.productOrderId = productOrderId;
    }
    viewDownload(productOrderId: string) {
        this.modalRef = this.detailModalService.openDownload();
        this.modalRef.componentInstance.productOrderId = productOrderId;
    }

    filterByStatus() {
        this.filteredProductOrder = this.productOrder;
        if (!(this.selectedStatus.toUpperCase() === 'ALL')) {
            this.filteredProductOrder = this.filteredProductOrder.filter(x => x.status.toUpperCase() === this.selectedStatus.toUpperCase());
        }
        this.getQuantity();
        this.setStatusCaption();
    }
    protected setStatusCaption() {
        if (this.selectedStatus === Orderstatus.CANCELLED) {
            this.statusCaption = 'cancelled';
        }
        if (this.selectedStatus === Orderstatus.COMPLETED) {
            this.statusCaption = 'completed';
        }
        if (this.selectedStatus === Orderstatus.PENDING) {
            this.statusCaption = 'pending';
        }
        if (this.selectedStatus === 'ALL' || this.selectedStatus === null) {
            this.statusCaption = '';
        }
    }
}
