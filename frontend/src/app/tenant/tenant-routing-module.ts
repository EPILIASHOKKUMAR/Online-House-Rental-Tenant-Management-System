import { Routes } from '@angular/router';

export const TENANT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/tenant-dashboard/tenant-dashboard.component')
        .then(m => m.TenantDashboardComponent)
  },
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
    path: 'bookings',
    loadComponent: () =>
      import('./components/booking-status/booking-status')
        .then(m => m.BookingStatusComponent)
  },
  {
    path: 'my-bookings',
    redirectTo: 'bookings',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
