import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CarInspection } from '../../../models/carInspection.model';
import { termsAndConditions } from '../../../models/constants/terms-and-conditions.const';
import * as _moment from 'moment';

@Component({
    selector: 'inspection-document',
    templateUrl: './inspection-document.component.html',
    styleUrls: ['./inspection-document.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})
export class InspectionDocumentComponent implements OnInit {
    carInspection: CarInspection;
    termsAndConditions = termsAndConditions;
    inspectionDate: string;
    inspectionDateTime: string;
    
    constructor(
        public dialogRef: MatDialogRef<InspectionDocumentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        this.carInspection = this.data.carInspection;
        let date = _moment(this.carInspection.inspectionDate.toDate()).locale('es');
        this.inspectionDate = date.format('LL');
        this.inspectionDateTime = _moment(this.carInspection.inspectionDate.toDate()).format('h:mm:ss a');
    }

    close(): void {
        this.dialogRef.close();
    }

    convertToPDF(): void {
        // TODO
    }

}
