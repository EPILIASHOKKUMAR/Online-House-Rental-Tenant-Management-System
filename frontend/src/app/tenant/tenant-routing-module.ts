import { Routes } from '@angular/router';
import { PropertyListComponent } from './components/property-list/property-list';
import { PropertyDetailsComponent } from './components/property-details/property-details';
import { BookingRequestComponent } from './components/booking-request/booking-request';
import { BookingStatusComponent } from './components/booking-status/booking-status';

export const TENANT_ROUTES: Routes = [
  {
    path: 'properties',
    loadComponent: () =>
      import('./components/property-list/property-list')
        .then(m => m.PropertyListComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () =>
      import('./components/property-details/property-details')
        .then(m => m.PropertyDetailsComponent)
  },
  {
    path: 'properties/:id/book',
    loadComponent: () =>
      import('./components/booking-request/booking-request')
        .then(m => m.BookingRequestComponent)
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./components/booking-status/booking-status')
        .then(m => m.BookingStatusComponent)
  }
];
