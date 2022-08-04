import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientsHomeComponent } from './clients-home/clients-home.component';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { InspectionsListComponent } from './inspections-list/inspections-list.component';
import { QuotationHomeComponent } from './quotation-home/quotation-home.component';
import { SharedModule } from './shared/shared.model';
import { ReceiptHomeComponent } from './receipt-home/receipt-home.component';
import { CreateReceiptDialogComponent } from './shared/components/dialogs/create-receipt-dialog/create-receipt-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InspectionHomeComponent,
    ClientsHomeComponent,
    InspectionsListComponent,
    QuotationHomeComponent,
    ReceiptHomeComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'kcd-inspection'),
    AngularFirestoreModule, // Only required for database features
    AngularFireAuthModule, // Only required for auth features
    AngularFireStorageModule, // Only required for storage features
    CommonModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
