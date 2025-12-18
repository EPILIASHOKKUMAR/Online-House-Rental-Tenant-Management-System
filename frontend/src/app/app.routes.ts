import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminPropertiesComponent } from './admin/admin-properties/admin-properties.component';

import { PropertyListComponent } from './tenant/components/property-list/property-list';
import { PropertyDetailsComponent } from './tenant/components/property-details/property-details';
import { BookingRequestComponent } from './tenant/components/booking-request/booking-request';
import { BookingStatusComponent } from './tenant/components/booking-status/booking-status';


import { OwnerDashboardComponent } from './owner/owner-dashboard/owner-dashboard';
import { AddPropertyComponent } from './owner/add-property/add-property';
import { ManagePropertiesComponent } from './owner/manage-properties/manage-properties';
import { BookingRequestsComponent } from './owner/booking-requests/booking-requests';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/properties', component: AdminPropertiesComponent },

  { path: 'properties', component: PropertyListComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'booking-request/:id', component: BookingRequestComponent },
  { path: 'booking-status', component: BookingStatusComponent },

  
  { path: 'owner/dashboard', component: OwnerDashboardComponent },
  { path: 'owner/add-property', component: AddPropertyComponent },
  { path: 'owner/manage-properties', component: ManagePropertiesComponent },
  { path: 'owner/booking-requests', component: BookingRequestsComponent }
];
