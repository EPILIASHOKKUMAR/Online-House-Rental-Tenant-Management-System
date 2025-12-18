import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard';
import { AddPropertyComponent } from './add-property/add-property';
import { ManagePropertiesComponent } from './manage-properties/manage-properties';
import { BookingRequestsComponent } from './booking-requests/booking-requests';

const routes: Routes = [
  { path: 'dashboard', component: OwnerDashboardComponent },
  { path: 'add-property', component: AddPropertyComponent },
  { path: 'manage-properties', component: ManagePropertiesComponent },
  { path: 'booking-requests', component: BookingRequestsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule {}
