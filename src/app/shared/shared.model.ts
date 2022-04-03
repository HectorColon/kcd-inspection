import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { NgWhiteboardModule, NgWhiteboardService } from 'ng-whiteboard';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { AngularMaterialModule } from '../app-material.module';
import { InspectionDocumentComponent } from './components/dialogs/inspection-document/inspection-document.component';
import { QuotationDocumentComponent } from './components/dialogs/quotation-document/quotation-document.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { DateTimeConverterPipe } from './pipe/date-time-converter.pipe';

@NgModule({
    imports: [
        AngularMaterialModule,
        NgxMaskModule.forRoot(),
        SignaturePadModule,
        NgWhiteboardModule,
        ToastrModule.forRoot({
            timeOut: 10000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }), // ToastrModule added
        BrowserAnimationsModule, // required animations module
        FlexModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule
    ],
    exports: [
        AngularMaterialModule,
        NgxMaskModule,
        SignaturePadModule,
        NgWhiteboardModule,
        ToastrModule,
        BrowserAnimationsModule, // required animations module
        LoaderComponent,
        InspectionDocumentComponent,
        UserLoginComponent,
        FlexModule,
        DateTimeConverterPipe,
        QuotationDocumentComponent,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule
    ],
    providers: [NgWhiteboardService],
    declarations: [LoaderComponent, InspectionDocumentComponent, UserLoginComponent, DateTimeConverterPipe, QuotationDocumentComponent],
    entryComponents: [InspectionDocumentComponent, UserLoginComponent, QuotationDocumentComponent]
})
export class SharedModule { }
