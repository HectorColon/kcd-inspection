import { Client } from "./client.model";
import { Service } from "./service.model";
import { User } from "./user.model";

export class Receipt {
    receiptId?: string;
    receiptNumber?: string;
    receiptDate?: any;
    user?: User;
    client?: Client;
    services?: Service[];
    receiptNote?: string;
    paymentMethod?: Number;
    amountReceived?: Number;
}