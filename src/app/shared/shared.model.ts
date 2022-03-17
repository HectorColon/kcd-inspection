import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { NgWhiteboardModule, NgWhiteboardService } from 'ng-whiteboard';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { AngularMaterialModule } from '../app-material.module';
import { InspectionDocumentComponent } from './components/inspection-document/inspection-document.component';
import { LoaderComponent } from './components/loader/loader.component';

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
    ],
    exports: [
        AngularMaterialModule,
        NgxMaskModule,
        SignaturePadModule,
        NgWhiteboardModule,
        ToastrModule,
        BrowserAnimationsModule, // required animations module
        LoaderComponent,
        InspectionDocumentComponent
    ],
    providers: [NgWhiteboardService],
    declarations: [LoaderComponent, InspectionDocumentComponent],
    entryComponents: [InspectionDocumentComponent]
})
export class SharedModule { }
