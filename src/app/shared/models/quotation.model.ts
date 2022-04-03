import { Client } from "./client.model";
import { Service } from "./service.model";
import { User } from "./user.model";

export class Quotation {
    quotationId?: string;
    quotationNumber?: string;
    quotationDate?: any;
    user?: User;
    client?: Client;
    services?: Service[];
    quotationNote?: string;
}