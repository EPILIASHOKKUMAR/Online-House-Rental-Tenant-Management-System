import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminPropertiesComponent } from './admin/admin-properties/admin-properties.component';

import { TenantDashboardComponent } from './tenant/tenant-dashboard/tenant-dashboard.component';
import { TenantPropertiesComponent } from './tenant/tenant-properties/tenant-properties.component';
import { TenantBookingsComponent } from './tenant/tenant-bookings/tenant-bookings.component';

import { adminGuard } from './guards/admin.guard';
import { tenantGuard } from './guards/tenant.guard';


// import { OwnerDashboardComponent } from './owner/owner-dashboard/owner-dashboard';
// import { AddPropertyComponent } from './owner/add-property/add-property';
// import { ManagePropertiesComponent } from './owner/manage-properties/manage-properties';
// import { BookingRequestsComponent } from './owner/booking-requests/booking-requests';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin-login', component: AdminLoginComponent },

  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard] },
  { path: 'admin/properties', component: AdminPropertiesComponent, canActivate: [adminGuard] },

  { path: 'tenant/dashboard', component: TenantDashboardComponent, canActivate: [tenantGuard] },
  { path: 'tenant/properties', component: TenantPropertiesComponent, canActivate: [tenantGuard] },
  { path: 'tenant/bookings', component: TenantBookingsComponent, canActivate: [tenantGuard] },
  
  // Legacy routes for backward compatibility
  { path: 'properties', redirectTo: 'tenant/properties', pathMatch: 'full' },
  { path: 'property/:id', redirectTo: 'tenant/properties', pathMatch: 'full' },
  { path: 'booking-request/:id', redirectTo: 'tenant/properties', pathMatch: 'full' },
  { path: 'booking-status', redirectTo: 'tenant/bookings', pathMatch: 'full' }

  
  // { path: 'owner/dashboard', component: OwnerDashboardComponent },
  // { path: 'owner/add-property', component: AddPropertyComponent },
  // { path: 'owner/manage-properties', component: ManagePropertiesComponent },
  // { path: 'owner/booking-requests', component: BookingRequestsComponent }
];
