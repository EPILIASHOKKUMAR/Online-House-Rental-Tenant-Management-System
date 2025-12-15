import { Routes } from '@angular/router';

// Home
import { HomeComponent } from './home/home.component';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

// Admin
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

// Tenant
import { PropertyListComponent } from './tenant/components/property-list/property-list';
import { PropertyDetailsComponent } from './tenant/components/property-details/property-details';
import { BookingRequestComponent } from './tenant/components/booking-request/booking-request';
import { BookingStatusComponent } from './tenant/components/booking-status/booking-status';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // admin routes
  { path: 'admin/dashboard', component: AdminDashboardComponent },

  // tenant routes
  { path: 'properties', component: PropertyListComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  { path: 'booking-request/:id', component: BookingRequestComponent },
  { path: 'booking-status', component: BookingStatusComponent }
];
