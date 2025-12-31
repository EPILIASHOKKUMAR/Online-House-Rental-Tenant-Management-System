import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookingService, Booking } from '../../../services/booking.service';
import { SocketService } from '../../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.css']
})
export class TenantDashboardComponent implements OnInit, OnDestroy {

  private socketSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private socketService: SocketService
  ) {}

  isSidebarCollapsed = false;
  userName = 'Tenant';
  userId = 0;

  totalBookings = 0;
  pendingBookings = 0;
  approvedBookings = 0;
  rejectedBookings = 0;

  recentBookings: Booking[] = [];
  isLoading = true;

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.userName = userData.name || 'Tenant';
      this.userId = userData.id;
      this.loadBookings();
      
      this.socketService.connect();
      
      this.socketSubscription = this.socketService.bookingStatusUpdate$.subscribe(
        (update) => {
          this.loadBookings();
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
    if (this.userId) {
      this.bookingService.getTenantBookings(this.userId).subscribe({
        next: (bookings) => {
          this.recentBookings = bookings.slice(0, 5);
          this.totalBookings = bookings.length;
          this.pendingBookings = bookings.filter(b => b.status === 'pending').length;
          this.approvedBookings = bookings.filter(b => b.status === 'approved').length;
          this.rejectedBookings = bookings.filter(b => b.status === 'rejected').length;
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
    this.socketService.disconnect();
    this.router.navigate(['/']);
  }
}
