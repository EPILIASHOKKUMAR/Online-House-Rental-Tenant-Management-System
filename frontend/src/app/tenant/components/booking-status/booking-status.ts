import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { SocketService, BookingStatusUpdate } from '../../../services/socket.service';

interface Booking {
  id: number;
  property_id: number;
  status: string;
  message: string;
  request_time: string;
  response_time: string;
  property_title: string;
  location: string;
  rent: number;
  photos: string[];
  owner_name: string;
  owner_phone: string;
}

@Component({
  selector: 'app-booking-status',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './booking-status.html',
  styleUrls: ['./booking-status.css']
})
export class BookingStatusComponent implements OnInit, OnDestroy {

  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/bookings';
  private socketSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: SocketService
  ) {}

  isSidebarCollapsed = false;
  bookings: Booking[] = [];
  isLoading = true;
  userId = 0;
  notification: string | null = null;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.loadBookings();
      
      this.socketService.connect();
      
      this.socketSubscription = this.socketService.bookingStatusUpdate$.subscribe(
        (update: BookingStatusUpdate) => {
          this.handleStatusUpdate(update);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  handleStatusUpdate(update: BookingStatusUpdate): void {
    const booking = this.bookings.find(b => b.id === update.bookingId);
    if (booking) {
      booking.status = update.status;
      this.notification = update.message;
      
      setTimeout(() => {
        this.notification = null;
      }, 5000);
    }
  }

  loadBookings(): void {
    this.http.get<Booking[]>(`${this.apiUrl}/tenant/${this.userId}`).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.isLoading = false;
      }
    });
  }

  cancelBooking(bookingId: number): void {
    if (confirm('Are you sure you want to cancel this booking request?')) {
      this.http.delete(`${this.apiUrl}/${bookingId}`).subscribe({
        next: () => {
          alert('Booking cancelled successfully');
          this.loadBookings();
        },
        error: (error) => {
          alert(error.error?.error || 'Failed to cancel booking');
        }
      });
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.socketService.disconnect();
    this.router.navigate(['/']);
  }
}
