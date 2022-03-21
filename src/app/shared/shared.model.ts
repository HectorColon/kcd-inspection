import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { NgWhiteboardModule, NgWhiteboardService } from 'ng-whiteboard';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { AngularMaterialModule } from '../app-material.module';
import { InspectionDocumentComponent } from './components/inspection-document/inspection-document.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UserLoginComponent } from './components/user-login/user-login.component';

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
        FlexModule
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
        FlexModule
    ],
    providers: [NgWhiteboardService],
    declarations: [LoaderComponent, InspectionDocumentComponent, UserLoginComponent],
    entryComponents: [InspectionDocumentComponent, UserLoginComponent]
})
export class SharedModule { }
