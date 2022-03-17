import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsHomeComponent } from './clients-home/clients-home.component';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { InspectionsListComponent } from './inspections-list/inspections-list.component';


const routes: Routes = [
  { path: 'inspection-home', component: InspectionHomeComponent },
  { path: 'clients-home', component: ClientsHomeComponent },
  { path: 'inspections-list', component: InspectionsListComponent },
  { path: '**', component: InspectionHomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
