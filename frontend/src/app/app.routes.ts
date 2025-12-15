import { Routes } from '@angular/router';
import { PropertyListComponent } from './tenant/components/property-list/property-list';
import { PropertyDetailsComponent } from './tenant/components/property-details/property-details';
import { BookingRequestComponent } from './tenant/components/booking-request/booking-request';
import { BookingStatusComponent } from './tenant/components/booking-status/booking-status';

export const routes: Routes = [
  { path: '', redirectTo: 'properties', pathMatch: 'full' },
  { path: 'properties', component: PropertyListComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'booking-request/:id', component: BookingRequestComponent },
  { path: 'booking-status', component: BookingStatusComponent }
];
