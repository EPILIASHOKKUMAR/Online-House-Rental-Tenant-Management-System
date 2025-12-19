import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

interface BookingRequest {
  id: number;
  propertyId: number;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  rent: number;
  moveInDate: Date;
  message?: string;
}

@Component({
  selector: 'app-tenant-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    MatChipsModule,
    MatTableModule
  ],
  templateUrl: './tenant-bookings.component.html',
  styleUrls: ['./tenant-bookings.component.css']
})
export class TenantBookingsComponent {
  
  bookingRequests: BookingRequest[] = [
    {
      id: 1,
      propertyId: 101,
      propertyTitle: '2BHK Flat',
      propertyLocation: 'Bangalore',
      propertyImage: 'assets/images/house1.jpg',
      requestDate: new Date('2024-01-15'),
      status: 'approved',
      rent: 12000,
      moveInDate: new Date('2024-02-01'),
      message: 'Your booking request has been approved. Please contact the owner for further details.'
    },
    {
      id: 2,
      propertyId: 102,
      propertyTitle: '1BHK Apartment',
      propertyLocation: 'Hyderabad',
      propertyImage: 'assets/images/house2.jpg',
      requestDate: new Date('2024-01-20'),
      status: 'pending',
      rent: 8000,
      moveInDate: new Date('2024-02-15')
    },
    {
      id: 3,
      propertyId: 103,
      propertyTitle: '3BHK Villa',
      propertyLocation: 'Chennai',
      propertyImage: 'assets/images/house3.jpg',
      requestDate: new Date('2024-01-10'),
      status: 'rejected',
      rent: 25000,
      moveInDate: new Date('2024-01-25'),
      message: 'Unfortunately, your booking request has been rejected. The property is no longer available.'
    }
  ];

  get pendingBookings(): BookingRequest[] {
    return this.bookingRequests.filter(booking => booking.status === 'pending');
  }

  get approvedBookings(): BookingRequest[] {
    return this.bookingRequests.filter(booking => booking.status === 'approved');
  }

  get rejectedBookings(): BookingRequest[] {
    return this.bookingRequests.filter(booking => booking.status === 'rejected');
  }

  get allBookings(): BookingRequest[] {
    return this.bookingRequests;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'cancelled': return 'gray';
      default: return 'blue';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'pending': return 'schedule';
      case 'approved': return 'check_circle';
      case 'rejected': return 'cancel';
      case 'cancelled': return 'block';
      default: return 'help';
    }
  }

  cancelBooking(bookingId: number): void {
    const booking = this.bookingRequests.find(b => b.id === bookingId);
    if (booking && booking.status === 'pending') {
      booking.status = 'cancelled';
      console.log('Booking cancelled:', bookingId);
    }
  }

  contactOwner(propertyId: number): void {
    console.log('Contacting owner for property:', propertyId);
    // Implement contact owner functionality
  }

  logout(): void {
    localStorage.removeItem('userRole');
    window.location.href = '/';
  }
}