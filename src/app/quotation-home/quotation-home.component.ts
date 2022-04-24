import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CarWashService } from '../services/carwash.service';
import { EmailService } from '../services/emails/email.service';
import { ConfirmDialogComponent } from '../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { QuotationDocumentComponent } from '../shared/components/dialogs/quotation-document/quotation-document.component';
import { Client } from '../shared/models/client.model';
import { Quotation } from '../shared/models/quotation.model';

@Component({
	selector: 'quotation-home',
	templateUrl: './quotation-home.component.html',
	styleUrls: ['./quotation-home.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuotationHomeComponent implements OnInit {

	@ViewChild('quotationTable', { static: false }) quotationTable: MatTable<any>;
	
	isLoading: boolean = true;
	quotationList: Quotation[] = [];
	clientList: Client[] = [];
	displayedColumns: string[] = ['clientFullName', 'dateTime', 'quotationNumber', 'total', 'actions'];
	dataSource = new MatTableDataSource<Quotation>(this.quotationList);
	private _unsubscribeAll = new Subject();

	constructor(private _carWashService: CarWashService,
				private _route: Router,
				private _dialog: MatDialog,
				private _emailService: EmailService,
				private _ngxToastrService: ToastrService) { this._unsubscribeAll }

	ngOnInit(): void {
		if (!this._carWashService.isLoggedIn) { this._route.navigate(['/inspection-home']); return; }
		this._carWashService.getQuotes().pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
			this.quotationList = res.filter(x => x.quotationId != 'dummy');
			this.dataSource = new MatTableDataSource(this.quotationList);
			setTimeout(() => {
				this.isLoading = false;
			}, 3000);
		});

		this._carWashService.getClients().pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
			this.clientList = res.filter(x => x.clientId != 'dummy');
		});

		// MANUALLY ADD FROM THE DIALOG
		this._carWashService.quotation.subscribe(res => {
			if (res) {
				if (this.quotationList && this.quotationList.length <= 0) {
					this.quotationList.push(res);
				} else {
					let list = [...this.quotationList];
					this.quotationList = undefined;
					this.quotationList = [];
					list.unshift(res);
					this.quotationList = list;

					this.quotationTable.renderRows();
					this.dataSource = new MatTableDataSource(this.quotationList);
				}
			}
		});
	}

	createQuotation(isForEdit: boolean = true, quotation?: Quotation): void {
		const dialogRef = this._dialog.open(QuotationDocumentComponent, {
			width: isForEdit ? '650px' : '816px',
			height: isForEdit ? '775px' : '850px',
			data: {
				clientList: this.clientList,
				isForEdit: isForEdit,
				...quotation && { quotation: quotation}
			},
			autoFocus: false,
			disableClose: true
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res.continue) {
				this.createQuotation(res.isForEdit, res.quotation);
			}
		});
	}

	sendQuotation(quotation?: Quotation): void {
		this._ngxToastrService.info('Enviando cotización...');
		this._emailService.sendQuotationEmail(quotation);
	}

	deleteQuotation(quotation: Quotation): void {
		const dialogRef = this._dialog.open(ConfirmDialogComponent, {
			width: '500px',
			height: '250px',
			data: {
				title: '¿Desea eliminar esta cotización?',
				content: [`${this._carWashService.getDateFormat(quotation.quotationDate)} - ${quotation.client.clientFullName}`]
			},
			autoFocus: false,
		});

		dialogRef.afterClosed().subscribe(confirmed => {
			if (confirmed) {
				let list = [...this.quotationList];
				let index = list.findIndex(x => x.quotationId === quotation.quotationId);
				this.quotationList = undefined;
				this.quotationList = [];
				list.splice(index, 1);
				this.quotationList = list;

				this._ngxToastrService.success('Cotización eliminada exitosamente');
				this.quotationTable.renderRows();
				this.dataSource = new MatTableDataSource(this.quotationList);
				this._carWashService.deleteQuotation(quotation.quotationId);
			}
		});
	}

}
