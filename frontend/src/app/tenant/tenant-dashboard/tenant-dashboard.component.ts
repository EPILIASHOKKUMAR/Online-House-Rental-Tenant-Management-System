import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.css']
})
export class TenantDashboardComponent {
  
  searchQuery = '';
  selectedLocation = '';
  selectedBudget = '';
  selectedAmenities = '';

  totalProperties = 24;
  myBookings = 3;
  pendingRequests = 1;

  locations = ['Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai'];
  budgetRanges = ['5000-10000', '10000-15000', '15000-25000', '25000+'];
  amenities = ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Power Backup'];

  recentProperties = [
    { id: 101, title: '2BHK Flat', location: 'Bangalore', rent: 12000, image: 'assets/images/house1.jpg' },
    { id: 102, title: '1BHK Apartment', location: 'Hyderabad', rent: 8000, image: 'assets/images/house2.jpg' },
    { id: 103, title: '3BHK Villa', location: 'Chennai', rent: 25000, image: 'assets/images/house3.jpg' }
  ];

  onSearch(): void {
    console.log('Searching with:', {
      query: this.searchQuery,
      location: this.selectedLocation,
      budget: this.selectedBudget,
      amenities: this.selectedAmenities
    });
  }

  logout(): void {
    localStorage.removeItem('userRole');
    window.location.href = '/';
  }
}