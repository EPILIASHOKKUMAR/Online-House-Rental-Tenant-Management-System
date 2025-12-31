import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket.service';

interface Booking {
  id: number;
  property_id: number;
  tenant_id: number;
  status: string;
  message: string;
  request_time: string;
  property_title: string;
  location: string;
  rent: number;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
}

@Component({
  selector: 'app-owner-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './owner-bookings.component.html',
  styleUrls: ['./owner-bookings.component.css']
})
export class OwnerBookingsComponent implements OnInit, OnDestroy {

  private apiUrl = 'http://localhost:3000/api/bookings';
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

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.loadBookings();
      
      this.socketService.connect();
      
      this.socketSubscription = this.socketService.newBooking$.subscribe(
        (data) => {
          this.notification = data.message;
          this.loadBookings();
          
          setTimeout(() => {
            this.notification = null;
          }, 5000);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  loadBookings(): void {
    this.http.get<Booking[]>(`${this.apiUrl}/owner/${this.userId}`).subscribe({
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

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  approveBooking(bookingId: number): void {
    this.http.put(`${this.apiUrl}/${bookingId}/status`, { status: 'approved' }).subscribe({
      next: () => {
        alert('Booking approved successfully!');
        this.loadBookings();
      },
      error: (error) => {
        alert('Failed to approve booking');
      }
    });
  }

  rejectBooking(bookingId: number): void {
    this.http.put(`${this.apiUrl}/${bookingId}/status`, { status: 'rejected' }).subscribe({
      next: () => {
        alert('Booking rejected');
        this.loadBookings();
      },
      error: (error) => {
        alert('Failed to reject booking');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.socketService.disconnect();
    this.router.navigate(['/']);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN');
  }
}
