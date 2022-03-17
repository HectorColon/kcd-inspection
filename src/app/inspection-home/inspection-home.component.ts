import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { FormatType, NgWhiteboardService, WhiteboardOptions } from 'ng-whiteboard';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CarWashServiceService } from '../services/carwash-service.service';
import { CarInspection } from '../shared/models/carInspection.model';
import { Client } from '../shared/models/client.model';
import { termsAndConditions } from '../shared/models/constants/terms-and-conditions.const';

@Component({
    selector: 'inspection-home',
    templateUrl: './inspection-home.component.html',
    styleUrls: ['./inspection-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InspectionHomeComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    carInspectionForm: FormGroup;
    inspectionDate = new Date;
    clientList: Client[] = [];
    clientDefaultList: Client[] = [];
    filteredClientList: Client[] = [];
    termsAndConditions = termsAndConditions;
    isClientSelected: boolean = false; //To create the Client Object
    isInspectionDrawingSaved: boolean = false; //To create the Client Object
    isSignatureDrawingSaved: boolean = false; //To create the Client Object
    selectedClientName: string = '';
    isLoading: boolean = true;
    whiteBoardOptions: WhiteboardOptions = {
        color: '#000000',
        backgroundColor: '#ffffff',
        size: '2.5px',
        linejoin: 'round',
        linecap: 'round'
    }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-type': 'application/json' })
    }

    private _unsubscribeAll = new Subject();

    constructor(private _formBuilder: FormBuilder,
        private _carWashService: CarWashServiceService,
        private _whiteboardService: NgWhiteboardService,
        private _ngxToastrService: ToastrService,
        private _httpClient: HttpClient) { this._unsubscribeAll }

    ngOnInit() {
        //INITIALIZE CAR INSPECTION FORM
        this.setCarInspectionForm();

        //GET THE CLIENT'S LIST (NEED IMPROVEMENTS)
        this._carWashService.getClients().pipe(take(1), takeUntil(this._unsubscribeAll)).subscribe(res => {
            this.clientList = res.filter(x => x.clientId != 'dummy');
            this.clientDefaultList = [...res.filter(x => x.clientId != 'dummy')];
            this.filteredClientList = [...res.filter(x => x.clientId != 'dummy')];
        });

        setTimeout(() => {
            this.isLoading = false;
            // SET CANVAS IMAGE
            this.setCanvasImage('car_model.jpg');
        }, 3500);

        this.subscribeToField();
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnChanges(): void {
    }

    public ngAfterViewInit() {
    }

    subscribeToField(): void {
        this.carInspectionForm.get('clientFullName').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(formValue => {
            return this.filteredClientList.filter(x => x.clientFullName.toLowerCase() === formValue.toLowerCase());
        });
    }

    setCarInspectionForm(): void {
        this.carInspectionForm = this._formBuilder.group({
            inspectionDate: [_moment(this.inspectionDate).format('MM/DD/YYYY')],
            clientFullName: [''],
            clientPhoneNumber: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            clientEmail: ['', [Validators.email]],
            inspectionNote: [''],
            inspectionDrawing: [''],
            termsAndConditionAccepted: [false],
            clientSignature: ['']
        });
    }

    displayWith(c: Client): string {
        return c ? c.clientFullName : undefined;
    }

    selectedClient(c: Client): void {
        if (c) {
            this.isClientSelected = true;
            this.carInspectionForm.get('clientFullName').setValue(c);
            this.carInspectionForm.get('clientPhoneNumber').setValue(c.clientPhoneNumber);
            this.carInspectionForm.get('clientEmail').setValue(c.clientEmail);
            this.selectedClientName = c.clientFullName;
        }
    }

    // WHITEBOARD-HELPERS
    onClear(): void {
        this._whiteboardService.erase();
        // SET CANVAS IMAGE
        this.setCanvasImage('car_model.jpg');
        this.isInspectionDrawingSaved = false;
    }

    onRedo(): void {
        this._whiteboardService.redo();
    }

    onUndo(): void {
        this._whiteboardService.undo();
    }

    swapImage(model: string): void {
        
        this._whiteboardService.erase();
        this.setCanvasImage(model);
        
        this.isInspectionDrawingSaved = false;
    }

    onSaveButton(): void {
        this._whiteboardService.save(FormatType.Base64);
    }

    onSave(e: string): void {
        this.isInspectionDrawingSaved = true;
        this._ngxToastrService.success('Dibujo de inspección guardado exitosamente');
        this.carInspectionForm.get('inspectionDrawing').setValue(e);
    }

    // SIGNATURE HELPERS
    saveSignatureImage(e: any): void {
        this.isSignatureDrawingSaved = true;
        this._ngxToastrService.success('Firma del cliente guardado exitosamente');
        this.carInspectionForm.get('clientSignature').setValue(e);
    }

    createCarInspection(action: string): void {
        let carInspectionRequest: CarInspection = {
            dateTime: _moment(this.inspectionDate).format('MM-DD-YYYYTHH:mm:ss'),
            clientFullName: this.carInspectionForm.get('clientFullName').value && this.carInspectionForm.get('clientFullName').value.clientFullName ? this.carInspectionForm.get('clientFullName').value.clientFullName : this.carInspectionForm.get('clientFullName').value,
            clientPhoneNumber: this.carInspectionForm.get('clientPhoneNumber').value,
            clientEmail: this.carInspectionForm.get('clientEmail').value,
            inspectionNote: this.carInspectionForm.get('inspectionNote').value,
            inspectionDrawing: this.carInspectionForm.get('inspectionDrawing').value,
            termsAndConditionAccepted: this.carInspectionForm.get('termsAndConditionAccepted').value,
            clientSignature: this.carInspectionForm.get('clientSignature').value,
        }
        console.log(carInspectionRequest);
        // CREATE CAR INSPECTION
        this._carWashService.addInspection(carInspectionRequest);

        //CREATE CLIENT IF IT'S NOT SELECTED FROM THE LIST
        if (!this.isClientSelected) {
            this.isClientSelected = false; //RESTE VARIABLE TO THEIR ORIGINAL STATE
            this._carWashService.addClient({
                clientFullName: this.carInspectionForm.get('clientFullName').value,
                clientPhoneNumber: this.carInspectionForm.get('clientPhoneNumber').value,
                clientEmail: this.carInspectionForm.get('clientEmail').value,
            });

            //ADD MANUALLY TO THE CLIENT LIST
            this.clientList.push({
                clientFullName: this.carInspectionForm.get('clientFullName').value,
                clientPhoneNumber: this.carInspectionForm.get('clientPhoneNumber').value,
                clientEmail: this.carInspectionForm.get('clientEmail').value,
            });

            this._ngxToastrService.success('Información del Cliente guardado correctamente');
        }

        if (action === 'send') {
            let message = {
                from: "kathycarwashanddetailing@gmail.com",
                to: carInspectionRequest.clientEmail,
                subject: "Message title",
                text: "Plaintext version of the message",
                html: `
                        <div class="dcf-overflow-x-auto" tabindex="0">
            <table class="dcf-table dcf-w-100%">
                <thead>
                    <tr>
                        <td></td>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row"></th>
                        <td></td>
                    </tr>
                </tbody>
            </table></div>`
            };

        } else {
            this._ngxToastrService.success('Formulario Guardado exitosamente');
        }

        this.resetInspectionForm(true);
    }

    setCanvasImage(model: string = 'car_model.jpg'): void {
        this._httpClient.get(`../../assets/images/${model}`, { responseType: 'blob' }).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            const reader = new FileReader();

            reader.onloadend = () => {
                this._whiteboardService.addImage(reader.result);
            };

            if (res) {
                reader.readAsDataURL(res)
            }
        });
    }

    resetInspectionForm(fromButton: boolean = false): void {
        this.carInspectionForm.reset();
        this.setCarInspectionForm();
        this.isClientSelected = false;

        // RESET CANVAS IMAGE
        this.onClear();
        this.isInspectionDrawingSaved = false;
        this.isSignatureDrawingSaved = false;

        if (!fromButton) {
            this._ngxToastrService.warning('Formulario ha sido anulado');
        }
    }
}
