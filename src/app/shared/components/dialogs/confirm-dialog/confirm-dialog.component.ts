import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
    }

    confirmAction(bool): void {
        this.dialogRef.close(bool);
    }

    close(): void {
        this.dialogRef.close();
    }

}
