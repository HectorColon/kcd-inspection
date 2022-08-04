import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CarWashService } from '../services/carwash.service';
import { EmailService } from '../services/emails/email.service';
import { ConfirmDialogComponent } from '../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { CreateReceiptDialogComponent } from '../shared/components/dialogs/create-receipt-dialog/create-receipt-dialog.component';
import { QuotationDocumentComponent } from '../shared/components/dialogs/quotation-document/quotation-document.component';
import { Client } from '../shared/models/client.model';
import { Receipt } from '../shared/models/receipt.mode';

@Component({
    selector: 'receipt-home',
    templateUrl: './receipt-home.component.html',
    styleUrls: ['./receipt-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReceiptHomeComponent implements OnInit {
    @ViewChild('receiptTable', { static: false }) receiptTable: MatTable<any>;

    isLoading: boolean = true;
    receiptList: Receipt[] = [];
    clientList: Client[] = [];
    displayedColumns: string[] = ['clientFullName', 'dateTime', 'receiptNumber', 'total', 'actions'];
    dataSource = new MatTableDataSource<Receipt>(this.receiptList);
    private _unsubscribeAll = new Subject();

    constructor(private _carWashService: CarWashService,
        private _route: Router,
        private _dialog: MatDialog,
        private _emailService: EmailService,
        private _ngxToastrService: ToastrService) { this._unsubscribeAll }

    ngOnInit(): void {
        if (!this._carWashService.isLoggedIn) { this._route.navigate(['/inspection-home']); return; }
        this._carWashService.getReceipts().pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.receiptList = res.filter(x => x.receiptId != 'dummy');
            this.dataSource = new MatTableDataSource(this.receiptList);
            setTimeout(() => {
                this.isLoading = false;
            }, 1200);
        });

        this._carWashService.getClients().pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.clientList = res.filter(x => x.clientId != 'dummy');
        });

        // MANUALLY ADD FROM THE DIALOG
        this._carWashService.quotation.subscribe(res => {
            if (res) {
                if (this.receiptList && this.receiptList.length <= 0) {
                    this.receiptList.push(res);
                } else {
                    let list = [...this.receiptList];
                    this.receiptList = undefined;
                    this.receiptList = [];
                    list.unshift(res);
                    this.receiptList = list;

                    this.receiptTable.renderRows();
                    this.dataSource = new MatTableDataSource(this.receiptList);
                }
            }
        });
    }

    createReceipt(isForEdit: boolean = true, receipt?: Receipt): void {
        const dialogRef = this._dialog.open(CreateReceiptDialogComponent, {
        width: '650px',
        height: '775px',
          data: {
            clientList: this.clientList,
          },
          autoFocus: false,
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(res => {
          if (res.continue) {
            // this.createReceipt(res.isForEdit, res.receipt);
          }
        });
    }

    sendReceipt(receipt?: Receipt): void {
        this._ngxToastrService.info('Enviando recibo...');
        this._emailService.sendQuotationEmail(receipt);
    }

    deleteReceipt(receipt?: Receipt): void {
        const dialogRef = this._dialog.open(ConfirmDialogComponent, {
            width: '500px',
            height: '250px',
            data: {
                title: '¿Desea eliminar este reciobo?',
                content: [`${this._carWashService.getDateFormat(receipt.receiptDate)} #${receipt.receiptNumber} - ${receipt.client.clientFullName}`]
            },
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                let list = [...this.receiptList];
                let index = list.findIndex(x => x.receiptId === receipt.receiptId);
                this.receiptList = undefined;
                this.receiptList = [];
                list.splice(index, 1);
                this.receiptList = list;

                this._ngxToastrService.success('Recibo eliminada exitosamente');
                this.receiptTable.renderRows();
                this.dataSource = new MatTableDataSource(this.receiptList);
                this._carWashService.deleteQuotation(receipt.receiptId);
            }
        });
    }


}
