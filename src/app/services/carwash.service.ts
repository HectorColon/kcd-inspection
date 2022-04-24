import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { CarInspection } from '../shared/models/carInspection.model';
import { Client } from '../shared/models/client.model';
import { Quotation } from '../shared/models/quotation.model';
import { User } from '../shared/models/user.model';
import * as _moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class CarWashService {
    public isLoggedIn: boolean = false;
    private _user: User;

    user = new Subject<User>();
    logout = new Subject<any>();
    logged = new Subject<any>();
    quotation = new Subject<any>();

    get userLogged(): User {
        return this._user;
    }

    set setUserLogged(user: User) {
        this._user = user;
    }

    constructor(private firestore: AngularFirestore) { }

    // ADD
    addInspection(carInspection: CarInspection): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.firestore.collection("CarInspection").add(carInspection)
                .then(res => {
                    resolve(res);
                }, err => reject(err));
        });
    }

    addClient(client: Client): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.firestore.collection("Client").add(client)
                .then(res => {
                    resolve(res);
                }, err => reject(err));
        });
    }

    addQuotation(quotation: Quotation): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.firestore.collection("Quotation").add(quotation)
                .then(res => {
                    resolve(res);
                }, err => reject(err));
        });
    }

    //GET
    getInspections(): Observable<CarInspection[]> {
        return this.firestore.collection('CarInspection').valueChanges({ idField: 'inspectionId' });
    }

    getClients(): Observable<Client[]> {
        return this.firestore.collection("Client").valueChanges({ idField: 'clientId' });
    }

    getUsers(): Observable<User[]> {
        return this.firestore.collection("Users").valueChanges({ idField: 'userId' });
    }

    getQuotes(): Observable<Quotation[]> {
        return this.firestore.collection("Quotation").valueChanges({ idField: 'quotationId' });
    }

    //DELETE
    deleteInspection(inspectionId: string): void {
        this.firestore.collection('CarInspection').doc(inspectionId).delete();
    }

    deleteClient(clientId: string): void {
        this.firestore.collection('Client').doc(clientId).delete();
    }

    deleteQuotation(quotationId: string): void {
        this.firestore.collection('Quotation').doc(quotationId).delete();
    }

    //UPDATE
    updateUserStatus(user: User): void {
      this.firestore.collection('Users').doc(user.userId).update({isLoggedIn: user.isLoggedIn, ip: user.ip});
    }

    //HELPERS
    getDateFormat(value: any): string {
        let dateFormatted: string = '';

        if (_moment.isDate(value)) {
            let date = _moment(value).locale('es');
            dateFormatted = date.format('LL') + ' | ' + _moment(value).format('h:mm:ss a');
        } else {
            let date = _moment(value.toDate()).locale('es');
            dateFormatted = date.format('LL') + ' | ' + _moment(value.toDate()).format('h:mm:ss a');
        }

        return dateFormatted;
    }
}
