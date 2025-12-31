import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminPropertiesComponent } from './admin/admin-properties/admin-properties.component';

import { PropertyListComponent } from './tenant/components/property-list/property-list';
import { PropertyDetailsComponent } from './tenant/components/property-details/property-details';
import { BookingRequestComponent } from './tenant/components/booking-request/booking-request';
import { BookingStatusComponent } from './tenant/components/booking-status/booking-status';

import { tenantGuard } from './guards/tenant.guard';
import { ownerGuard } from './guards/owner.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin-login', component: AdminLoginComponent },

  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard] },
  { path: 'admin/properties', component: AdminPropertiesComponent, canActivate: [adminGuard] },
  {
    path: 'admin/bookings',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-bookings/admin-bookings.component').then(m => m.AdminBookingsComponent)
  },
  {
    path: 'admin/reports',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-reports/admin-reports.component').then(m => m.AdminReportsComponent)
  },
  {
    path: 'admin/settings',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent)
  },

  { path: 'properties', component: PropertyListComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'booking-request/:id', component: BookingRequestComponent, canActivate: [tenantGuard] },
  { path: 'booking-status', component: BookingStatusComponent, canActivate: [tenantGuard] },

  {
    path: 'tenant/dashboard',
    canActivate: [tenantGuard],
    loadComponent: () => import('./tenant/components/tenant-dashboard/tenant-dashboard.component').then(m => m.TenantDashboardComponent)
  },
  {
    path: 'tenant/properties',
    canActivate: [tenantGuard],
    loadComponent: () => import('./tenant/components/property-list/property-list').then(m => m.PropertyListComponent)
  },
  {
    path: 'tenant/properties/:id',
    canActivate: [tenantGuard],
    loadComponent: () => import('./tenant/components/property-details/property-details').then(m => m.PropertyDetailsComponent)
  },
  {
    path: 'tenant/properties/:id/book',
    canActivate: [tenantGuard],
    loadComponent: () => import('./tenant/components/booking-request/booking-request').then(m => m.BookingRequestComponent)
  },
  {
    path: 'tenant/bookings',
    canActivate: [tenantGuard],
    loadComponent: () => import('./tenant/components/booking-status/booking-status').then(m => m.BookingStatusComponent)
  },
  {
    path: 'tenant/profile',
    canActivate: [tenantGuard],
    loadComponent: () => import('./tenant/components/tenant-profile/tenant-profile.component').then(m => m.TenantProfileComponent)
  },

  {
    path: 'owner/dashboard',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent)
  },
  {
    path: 'owner/properties',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-properties/owner-properties.component').then(m => m.OwnerPropertiesComponent)
  },
  {
    path: 'owner/add-property',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-addproperty/owner-addproperty.component').then(m => m.OwnerAddPropertyComponent)
  },
  {
    path: 'owner/edit-property',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-properties/owner-properties.component').then(m => m.OwnerPropertiesComponent)
  },
  {
    path: 'owner/edit-property/:id',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-editproperty/owner-edit-property.component').then(m => m.OwnerEditPropertyComponent)
  },
  {
    path: 'owner/bookings',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-bookings/owner-bookings.component').then(m => m.OwnerBookingsComponent)
  },
  {
    path: 'owner/tenants',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-tenants/owner-tenants.component').then(m => m.OwnerTenantsComponent)
  },
  {
    path: 'owner/profile',
    canActivate: [ownerGuard],
    loadComponent: () => import('./owner/owner-profile/owner-profile.component').then(m => m.OwnerProfileComponent)
  }
];
