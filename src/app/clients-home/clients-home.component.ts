import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CarWashService } from '../services/carwash.service';
import { Client } from '../shared/models/client.model';

@Component({
    selector: 'clients-home',
    templateUrl: './clients-home.component.html',
    styleUrls: ['./clients-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClientsHomeComponent implements OnInit, OnDestroy {

    @ViewChild('clientTable', { static: false }) clientTable: MatTable<any>;

    clientList: Client[] = [];
    displayedColumns: string[] = ['clientFullName', 'clientPhoneNumber', 'clientEmail', 'actions'];
    dataSource = new MatTableDataSource<Client>(this.clientList);
    isLoading: boolean = true;

    private _unsubscribeAll = new Subject();

    constructor(private _carWashService: CarWashService,
        private _ngxToastrService: ToastrService,
        private _route: Router) { this._unsubscribeAll }

    ngOnInit(): void {
        if (!this._carWashService.isLoggedIn) { this._route.navigate(['/inspection-home']); return; }
        this._carWashService.getClients().pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.clientList = res.filter(x => x.clientId != 'dummy');
            this.dataSource = new MatTableDataSource(this.clientList);
            setTimeout(() => {
                this.isLoading = false;
            }, 3000);
        });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    deleteClient(clientId: string): void {
        let list = [...this.clientList];
        let index = list.findIndex(x => x.clientId === clientId);
        this.clientList = undefined;
        this.clientList = [];
        list.splice(index, 1);
        this.clientList = list;

        this._ngxToastrService.success('Cliente eliminado exitosamente');
        this.clientTable.renderRows();
        this.dataSource = new MatTableDataSource(this.clientList);
        this._carWashService.deleteClient(clientId);
    }
}
