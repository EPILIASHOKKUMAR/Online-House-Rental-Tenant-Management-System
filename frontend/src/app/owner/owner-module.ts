import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard';
import { AddPropertyComponent } from './add-property/add-property';
import { ManagePropertiesComponent } from './manage-properties/manage-properties';
import { BookingRequestsComponent } from './booking-requests/booking-requests';

@NgModule({
  imports: [
    CommonModule,

    // ✅ Standalone components go here
    OwnerDashboardComponent,
    AddPropertyComponent,
    ManagePropertiesComponent,
    BookingRequestsComponent
  ]
})
export class OwnerModule {}
