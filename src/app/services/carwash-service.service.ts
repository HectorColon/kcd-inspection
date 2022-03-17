import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CarInspection } from '../shared/models/carInspection.model';
import { Client } from '../shared/models/client.model';

@Injectable({
    providedIn: 'root'
})
export class CarWashServiceService {

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

    //GET
    getInspections(): Observable<CarInspection[]> {
        return this.firestore.collection('CarInspection').valueChanges({ idField: 'inspectionId' });
    }

    getClients(): Observable<Client[]> {
        return this.firestore.collection("Client").valueChanges({ idField: 'clientId' });
    }

    //DELETE
    deleteInspection(inspectionId: string): void {
        this.firestore.collection('CarInspection').doc(inspectionId).delete();
    }

    deleteClient(clientId: string): void {
        this.firestore.collection('Client').doc(clientId).delete();
    }

    //UPDATE
}
