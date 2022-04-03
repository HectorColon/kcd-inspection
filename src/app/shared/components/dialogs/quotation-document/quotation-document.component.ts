import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Client } from 'src/app/shared/models/client.model';
import { User } from 'src/app/shared/models/user.model';
import * as _moment from 'moment';
import { CarWashService } from 'src/app/services/carwash.service';
import { ToastrService } from 'ngx-toastr';
import { Quotation } from 'src/app/shared/models/quotation.model';
import { uid } from 'uid';

@Component({
	selector: 'quotation-document',
	templateUrl: './quotation-document.component.html',
	styleUrls: ['./quotation-document.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuotationDocumentComponent implements OnInit {

	clientList: Client[] = [];
	filteredClientList: Client[] = [];
	user: User;
	quotation: Quotation;
	quotationForm: FormGroup;
	quotationDate = new Date;
	quotationDateFormat: string;
	isClientSelected: boolean = false; //To create the Client Object
	totalSum: number;
	detailingServices = [{
		value: 0,
		display: 'Shampoo interiores',
		checked: false
	},{
		value: 1,
		display: 'Descontaminacion de Pintura',
		checked: false
	},
	{
		value: 2,
		display: 'Remoción de brea',
		checked: false
	}, {
		value: 3,
		display: 'Máquina de ozono/vapor',
		checked: false
	}, {
		value: 4,
		display: 'Pulido y Correción de pintura',
		checked: false
	}, {
		value: 5,
		display: 'Limpieza y tratamiento de leather',
		checked: false
	}, {
		value: 6,
		display: 'Servicio cera liquida/pasta',
		checked: false
	}, {
		value: 7,
		display: 'Tratamiento de cerámica int/ext',
		checked: false
	}, {
		value: 8,
		display: 'Remoción manchas en cristales',
		checked: false
	}];

	get services() {
		return this.quotationForm.controls["services"] as FormArray;
	}

	constructor(public dialogRef: MatDialogRef<QuotationDocumentComponent>,
		private _formBuilder: FormBuilder,
		private _changeDetectRef: ChangeDetectorRef,
		private _carWashService: CarWashService,
		private _ngxToastrService: ToastrService,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
		this.clientList = this.data.clientList;
		this.filteredClientList = [...this.clientList];
		this.user = this.data.user;

		// ISFOREDIT = FALSE
		if (!this.data.isForEdit && this.data.quotation) {
			this.quotation = this.data.quotation;

			// TO FIX
			// let date = _moment(this.data.quotation.quotationDate.toDate()).locale('es');
			// this.quotationDateFormat = date.format('MM/DD/YYYY');

			// SUM TOTAL OF AMOUNTS
			let sum: number = 0;
			this.quotation.services.forEach(a => sum += a.amount);
			this.totalSum = sum;
		}

		// CALL FORM AND SUBSCRIBE ONLY IN EDIT MODE
		if (this.data.isForEdit) {
			this.buildQuotationForm();
			this.subscribeToField();
		}
	}

	buildQuotationForm(): void {
		this.quotationForm = this._formBuilder.group({
			quotationDate: [_moment(this.quotationDate).format('MM/DD/YYYY')],
			clientFullName: [this.data.quotation ? this.data.quotation.client.clientFullName : ''],
			clientId: [this.data.quotation ? this.data.quotation.client.clientId : ''],
			clientPhoneNumber: [this.data.quotation ? this.data.quotation.client.clientPhoneNumber : '', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
			clientEmail: [this.data.quotation ? this.data.quotation.client.clientEmail : '', [Validators.email]],
			services: this._formBuilder.array([]),
			quotationNote: [this.data.quotation ? this.data.quotation.quotationNote : '']
		});

		this.detailingServices.forEach(ds => {
			this.services.push(this._formBuilder.group({
				value: [ds.value],
				display: [ds.display],
				amount: [0, [Validators.required]],
				checked: [ds.checked]
			}));
		});

		// POPULATE SELECTED SERVICES
		if (this.data.quotation && this.data.quotation.services && this.data.quotation.services.length > 0) {
			// SERVICES
			this.services.value.forEach(s => {
				let index = this.data.quotation.services.findIndex(x => x.id === s.value);
				if (index > -1) {
					this.services.controls[index].get('amount').setValue(this.data.quotation.services.find(x => x.id === s.value).amount);
					this.services.controls[index].get('checked').setValue(true);
				}
			});
		}
	}

	subscribeToField(): void {
		this.quotationForm.get('clientFullName').valueChanges.subscribe(formValue => {
			if (formValue && typeof formValue === 'string') {
				if (formValue != '') {
					this.filteredClientList = this._filter(formValue);
				} else {
					this.filteredClientList = this.clientList;
				}
			} else {
				this.filteredClientList = this.clientList;
			}
		});
	}

	private _filter(value: string): Client[] {
		const filterValue = value.toLowerCase();

		return this.filteredClientList.filter(option => option.clientFullName.toLowerCase().includes(filterValue));
	}

	displayWith(c: Client | any): string {
		return c ? c.clientFullName ? c.clientFullName : c : undefined;
	}

	selectedClient(c: Client): void {
		if (c) {
			this.isClientSelected = true; //To create the Client Object
			this.quotationForm.get('clientFullName').setValue(c);
			this.quotationForm.get('clientId').setValue(c.clientId);
			this.quotationForm.get('clientPhoneNumber').setValue(c.clientPhoneNumber);
			this.quotationForm.get('clientEmail').setValue(c.clientEmail);
		}
	}

	activeAmount(index: number, checked: boolean): void {
		this.services.controls[index].get('checked').setValue(checked);
		this.services.controls[index].get('amount').setValue(
			this.services.controls[index].get('checked').value ? this.services.controls[index].get('amount').value : '');
		this._changeDetectRef.detectChanges();
	}

	convertToQuotation(isForEdit: boolean = true): void {
		if(isForEdit) {
			this._ngxToastrService.success('Convirtiendo cotización...');

			// REQUEST
			let quotationRequest: Quotation = {
				quotationNumber: _moment(this.quotationDate).format('YYYYMMDD-') + uid(3),
				quotationDate: new Date(),
				client: {
					...this.isClientSelected && { clientId: this.quotationForm.get('clientId').value },
					clientFullName: this.quotationForm.get('clientFullName').value && this.quotationForm.get('clientFullName').value.clientFullName ? this.quotationForm.get('clientFullName').value.clientFullName : this.quotationForm.get('clientFullName').value,
					clientPhoneNumber: this.quotationForm.get('clientPhoneNumber').value,
					clientEmail: this.quotationForm.get('clientEmail').value,
				},
				user: {
					userId: this.user.userId,
					userFullName: this.user.userFullName,
				},
				quotationNote: this.quotationForm.get('quotationNote').value,
				services: []
			}

			// SERVICES
			this.services.value.forEach(s => {
				if (s.checked) {
					quotationRequest.services.push({
						id: s.value,
						amount: s.amount,
						service: s.display
					});
				}
			});

			// //CREATE CLIENT IF IT'S NOT SELECTED FROM THE LIST
			// if (!this.isClientSelected) {
			// 	this.isClientSelected = false; //RESTE VARIABLE TO THEIR ORIGINAL STATE
			// 	this._carWashService.addClient({
			// 		clientFullName: this.quotationForm.get('clientFullName').value,
			// 		clientPhoneNumber: this.quotationForm.get('clientPhoneNumber').value,
			// 		clientEmail: this.quotationForm.get('clientEmail').value,
			// 	});

			// 	//ADD MANUALLY TO THE CLIENT LIST
			// 	this.clientList.push({
			// 		clientFullName: this.quotationForm.get('clientFullName').value,
			// 		clientPhoneNumber: this.quotationForm.get('clientPhoneNumber').value,
			// 		clientEmail: this.quotationForm.get('clientEmail').value,
			// 	});

			// 	this._ngxToastrService.success('Información del Cliente guardado correctamente');
			// }

			// CONTINUE
			this.dialogRef.close({
				continue: true,
				isForEdit: false,
				quotation: quotationRequest
			});
		} else {
			// CONTINUE TO EDIT
			this.dialogRef.close({
				continue: true,
				isForEdit: true,
				quotation: this.quotation
			});
		}
	}

}
