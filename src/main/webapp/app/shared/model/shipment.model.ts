import { IInvoice } from 'app/shared/model/invoice.model';

export interface IShipment {
    id?: string;
    trackingCode?: string;
    invoice?: IInvoice;
}

export class Shipment implements IShipment {
    constructor(public id?: string, public trackingCode?: string, public invoice?: IInvoice) {}
}
