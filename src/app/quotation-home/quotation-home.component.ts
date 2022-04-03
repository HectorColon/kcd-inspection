import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CarWashService } from '../services/carwash.service';
import { QuotationDocumentComponent } from '../shared/components/dialogs/quotation-document/quotation-document.component';
import { Client } from '../shared/models/client.model';
import { Quotation } from '../shared/models/quotation.model';
import { User } from '../shared/models/user.model';

@Component({
	selector: 'quotation-home',
	templateUrl: './quotation-home.component.html',
	styleUrls: ['./quotation-home.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuotationHomeComponent implements OnInit {
	
	isLoading: boolean = false;
	quotationList: Quotation[] = [];
	userList: User[] = [];
	clientList: Client[] = [];
	dataSource = new MatTableDataSource<Quotation>(this.quotationList);
	private _unsubscribeAll = new Subject();

	constructor(private _carWashService: CarWashService,
				private _route: Router,
				private _dialog: MatDialog) { this._unsubscribeAll }

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

		// SET USER INFORMATION
		this._carWashService.user.subscribe(res => {
			this._carWashService.setUserLogged = res;
		});
	}

	createQuotation(isForEdit: boolean = true, quotation: Quotation): void {
		const dialogRef = this._dialog.open(QuotationDocumentComponent, {
			width: isForEdit ? '650px' : '816px',
			height: isForEdit ? '775px' : '850px',
			data: {
				clientList: this.clientList,
				user: this._carWashService.userLogged,
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

}
