import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxPrintElementService } from 'ngx-print-element';
import { ToastrService } from 'ngx-toastr';
import { CarWashService } from 'src/app/services/carwash.service';
import { EmailService } from 'src/app/services/emails/email.service';
import { Client } from 'src/app/shared/models/client.model';
import * as _moment from 'moment';
import { Receipt } from 'src/app/shared/models/receipt.mode';
import { uid } from 'uid';
import { inflate } from 'zlib';

@Component({
    selector: 'create-receipt-dialog',
    templateUrl: './create-receipt-dialog.component.html',
    styleUrls: ['./create-receipt-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CreateReceiptDialogComponent implements OnInit {

    @ViewChild('receiptPDF', { static: false }) quotationPDF: ElementRef;

    receiptForm: FormGroup;
    paymentMethodCtrl: FormControl = new FormControl('');
    amountReceivedCtrl: FormControl = new FormControl('');
    amountDueCtrl: FormControl = new FormControl('');
    receiptDate = new Date;
    receipt: Receipt;
    clientList: Client[] = [];
    filteredClientList: Client[] = [];
    isClientSelected: boolean = false;
    convertReceipt: boolean = false;
    subTotalSum: Number = 0;
    change: Number = 0;
    amountReceived: Number = 0;
    clientAdditionalInfo: string = '';

    detailingServices = [{
        value: 0,
        display: 'Shampoo interiores',
        checked: false
    }, {
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

    paymentMethod: any[] = [{
        value: 1,
        display: 'ATH Movil',
        checked: false
    },
    {
        value: 2,
        display: 'Eféctivo',
        checked: false
    }];

    get services() {
        return this.receiptForm.controls["services"] as FormArray;
    }


    constructor(public dialogRef: MatDialogRef<CreateReceiptDialogComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectRef: ChangeDetectorRef,
        private _carWashService: CarWashService,
        private _ngxToastrService: ToastrService,
        private _emailService: EmailService,
        private _print: NgxPrintElementService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.clientList = this.data.clientList;
        this.filteredClientList = [...this.clientList];

        this.buildReceiptForm();
        this.subscribeToServices();
    }

    close() {
        this.dialogRef.close({ continue: false })
    }

    buildReceiptForm(): void {
        this.receiptForm = this._formBuilder.group({
            receiptDate: [_moment(this.receiptDate).format('MM/DD/YYYY')],
            clientFullName: [this.data.receipt ? this.data.receipt.client.clientFullName : ''],
            clientId: [this.data.receipt ? this.data.receipt.client.clientId : ''],
            clientPhoneNumber: [this.data.receipt ? this.data.receipt.client.clientPhoneNumber : '', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            clientEmail: [this.data.receipt ? this.data.receipt.client.clientEmail : '', [Validators.email]],
            services: this._formBuilder.array([]),
            receiptNote: [this.data.receipt ? this.data.receipt.receiptNote : '']
        });

        this.detailingServices.forEach(ds => {
            this.services.push(this._formBuilder.group({
                value: [ds.value],
                display: [ds.display],
                amount: [0],
                checked: [ds.checked],
                isManual: [false]
            }));
        });
    }

    subscribeToServices(): void {
        this.services.valueChanges.subscribe(res => {
            let amountDue: Number = 0;
            res.forEach(x => {
                amountDue = amountDue + x.amount;
            });

            this.amountDueCtrl.setValue(amountDue);
        });
    }

    displayWith(c: Client | any): string {
        return c ? c.clientFullName ? c.clientFullName : c : undefined;
    }

    createManualService(): void {
        this.services.push(this._formBuilder.group({
            value: this.services.length + 1,
            display: [''],
            amount: [0],
            checked: true,
            isManual: true
        }));
    }

    selectedClient(c: Client): void {
        if (c) {
            this.isClientSelected = true; //To create the Client Object
            this.receiptForm.get('clientFullName').setValue(c);
            this.receiptForm.get('clientId').setValue(c.clientId);
            this.receiptForm.get('clientPhoneNumber').setValue(c.clientPhoneNumber);
            this.receiptForm.get('clientEmail').setValue(c.clientEmail);
        }
    }

    activeAmount(index: number, checked: boolean, isManual: boolean): void {
        if (isManual) {
            this.services.removeAt(index);
            return;
        }

        this.services.controls[index].get('checked').setValue(checked);
        this.services.controls[index].get('amount').setValue(
            this.services.controls[index].get('checked').value ? this.services.controls[index].get('amount').value : '');
        this._changeDetectRef.detectChanges();
    }


    convertToReceipt(): void {
        this.convertReceipt = !this.convertReceipt;
        // REQUEST
        let receiptRequest: Receipt = {
            receiptNumber: _moment(this.receiptDate).format('YYYYMMDD-') + uid(3),
            receiptDate: new Date(),
            client: {
                ...this.isClientSelected && { clientId: this.receiptForm.get('clientId').value },
                clientFullName: this.receiptForm.get('clientFullName').value && this.receiptForm.get('clientFullName').value.clientFullName ? this.receiptForm.get('clientFullName').value.clientFullName : this.receiptForm.get('clientFullName').value,
                clientPhoneNumber: this.receiptForm.get('clientPhoneNumber').value,
                clientEmail: this.receiptForm.get('clientEmail').value,
            },
            receiptNote: this.receiptForm.get('receiptNote').value,
            paymentMethod: this.paymentMethodCtrl.value,
            amountReceived: this.amountReceivedCtrl.value,
            services: [],
            ...this._carWashService.userLogged && { user: this._carWashService.userLogged }
        }

        // SERVICES
        this.services.value.forEach(s => {
            if (s.checked || s.isManual) {
                receiptRequest.services.push({
                    id: s.value,
                    amount: s.amount,
                    service: s.display
                });

                this.subTotalSum = this.subTotalSum + s.amount;
            }
        });

        // IF ONLY NEED A RECEIPT
        if (receiptRequest.services && receiptRequest.services.length <= 0) {
            this.subTotalSum = this.amountReceivedCtrl.value
        }

        this.amountReceived = this.amountReceivedCtrl.value;
        this.change = +this.amountReceivedCtrl.value - +this.subTotalSum;

        if(receiptRequest.client) {
            if (receiptRequest.client.clientPhoneNumber && receiptRequest.client.clientPhoneNumber != '' && !receiptRequest.client.clientEmail){
                this.clientAdditionalInfo = receiptRequest.client.clientPhoneNumber;
            }

            if (receiptRequest.client.clientEmail && receiptRequest.client.clientEmail != '' && !receiptRequest.client.clientPhoneNumber) {
                this.clientAdditionalInfo = receiptRequest.client.clientEmail;
            }

            if (receiptRequest.client.clientPhoneNumber && receiptRequest.client.clientPhoneNumber != '' &&
                receiptRequest.client.clientEmail && receiptRequest.client.clientEmail != '') {

                this.clientAdditionalInfo = receiptRequest.client.clientPhoneNumber + " | " + receiptRequest.client.clientEmail;
            }
        }
        this.receipt = receiptRequest;
    }

}
