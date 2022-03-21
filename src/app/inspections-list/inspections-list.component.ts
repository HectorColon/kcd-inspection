import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CarWashService } from '../services/carwash.service';
import { EmailService } from '../services/email.service';
import { InspectionDocumentComponent } from '../shared/components/inspection-document/inspection-document.component';
import { CarInspection } from '../shared/models/carInspection.model';

@Component({
    selector: 'inspections-list',
    templateUrl: './inspections-list.component.html',
    styleUrls: ['./inspections-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InspectionsListComponent implements OnInit, OnDestroy {

    @ViewChild('inspectionTable', { static: false }) inspectionTable: MatTable<any>;

    inspectionsList: CarInspection[] = [];
    displayedColumns: string[] = ['clientFullName', 'dateTime', 'inspectionDrawing', 'termsAndConditionAccepted','actions'];
    dataSource = new MatTableDataSource<CarInspection>(this.inspectionsList);
    isLoading: boolean = true;
    private _unsubscribeAll = new Subject();

    constructor(private _carWashService: CarWashService,
                private _ngxToastrService: ToastrService,
                private _dialog: MatDialog,
                private _emailService: EmailService,
                private _route: Router) { this._unsubscribeAll }

    ngOnInit(): void {
        if (!this._carWashService.isLoggedIn) { this._route.navigate(['/inspection-home']); return; }
        this._carWashService.getInspections().pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.inspectionsList = res.filter(x => x.inspectionId != 'dummy');
            this.dataSource = new MatTableDataSource(this.inspectionsList);
            setTimeout(() => {
                this.isLoading = false;
            }, 3000);
        });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    deleteInspection(inspectionId: string): void {
        let list = [...this.inspectionsList];
        let index = list.findIndex(x => x.inspectionId === inspectionId);
        this.inspectionsList = undefined;
        this.inspectionsList = [];
        list.splice(index, 1);
        this.inspectionsList = list;

        this._ngxToastrService.success('Inspección eliminada exitosamente');
        this.inspectionTable.renderRows();
        this.dataSource = new MatTableDataSource(this.inspectionsList);
        this._carWashService.deleteInspection(inspectionId);
    }

    openTransactionDocument(carInspection: CarInspection): void {
        const dialogRef = this._dialog.open(InspectionDocumentComponent, {
            width: '816px',
            height: '850px',
            data: { carInspection: carInspection }
        });

        dialogRef.afterClosed().subscribe();
    }

    sendInspection(carInspection: CarInspection): void {
        this._ngxToastrService.info('Enviando inspección...');
        this._emailService.sendEmail(carInspection);
    }
}
