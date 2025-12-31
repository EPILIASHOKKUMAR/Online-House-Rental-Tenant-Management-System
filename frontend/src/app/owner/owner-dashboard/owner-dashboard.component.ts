import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService } from '../../services/property.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private bookingService: BookingService
  ) {}

  isSidebarCollapsed = false;
  userName = 'Owner';
  userId = 0;

  totalProperties = 0;
  activeRentals = 0;
  pendingRequests = 0;
  approvedBookings = 0;

  isLoading = true;

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.userName = userData.name || 'Owner';
      this.userId = userData.id;
      this.loadData();
    }
  }

  loadData(): void {
    if (this.userId) {
      this.propertyService.getPropertiesByOwner(this.userId).subscribe({
        next: (properties) => {
          this.totalProperties = properties.length;
          this.activeRentals = properties.filter(p => p.status === 'rented').length;
        },
        error: (error) => console.error('Error loading properties:', error)
      });

      this.bookingService.getOwnerBookings(this.userId).subscribe({
        next: (bookings) => {
          this.pendingRequests = bookings.filter(b => b.status === 'pending').length;
          this.approvedBookings = bookings.filter(b => b.status === 'approved').length;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          this.isLoading = false;
        }
      });
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  totalPropertiesDiff = 0;
  activeRentalsDiff = 0;
  pendingRequestsDiff = 0;
  approvedBookingsDiff = 0;
}
