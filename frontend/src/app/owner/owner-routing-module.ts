import { Routes } from '@angular/router';
import { ownerGuard } from '../guards/owner.guard';

import { OwnerDashboardComponent } from './owner-dashboard/owner-dashboard.component';
import { OwnerPropertiesComponent } from './owner-properties/owner-properties.component';
import { OwnerAddPropertyComponent } from './owner-addproperty/owner-addproperty.component';
import { OwnerEditPropertyComponent } from './owner-editproperty/owner-edit-property.component';
import { OwnerBookingsComponent } from './owner-bookings/owner-bookings.component';
import { OwnerTenantsComponent } from './owner-tenants/owner-tenants.component';
import { OwnerProfileComponent } from './owner-profile/owner-profile.component';

export const ownerRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: OwnerDashboardComponent,
    canActivate: [ownerGuard]
  },
  {
    path: 'properties',
    component: OwnerPropertiesComponent,
    canActivate: [ownerGuard]
  },
  {
    path: 'add-property',
    component: OwnerAddPropertyComponent,
    canActivate: [ownerGuard]
  },
  {
    path: 'bookings',
    component: OwnerBookingsComponent,
    canActivate: [ownerGuard]
  },
  {
    path: 'tenants',
    component: OwnerTenantsComponent,
    canActivate: [ownerGuard]
  },
  {
    path: 'profile',
    component: OwnerProfileComponent,
    canActivate: [ownerGuard]
  },
  {
    path: 'edit-property',
    loadComponent: () =>
      import('./owner-editproperty/owner-edit-property.component')
        .then(m => m.OwnerEditPropertyComponent)
  },
  {
    path: 'edit-property/:id',
    loadComponent: () =>
      import('./owner-editproperty/owner-edit-property.component')
        .then(m => m.OwnerEditPropertyComponent)
  }
];
