import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {

  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/admin';

  isSidebarCollapsed = false;
  isLoading = true;

  stats = {
    totalUsers: 0,
    totalOwners: 0,
    totalTenants: 0,
    totalProperties: 0,
    availableProperties: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<any>(`${this.apiUrl}/stats`).subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isLoading = false;
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  get totalBookings(): number {
    return (this.stats.pendingBookings || 0) + (this.stats.approvedBookings || 0) + (this.stats.rejectedBookings || 0);
  }

  get bookingSuccessRate(): number {
    if (this.totalBookings === 0) return 0;
    return Math.round((this.stats.approvedBookings / this.totalBookings) * 100);
  }

  get propertyOccupancyRate(): number {
    if (this.stats.totalProperties === 0) return 0;
    const rented = this.stats.totalProperties - this.stats.availableProperties;
    return Math.round((rented / this.stats.totalProperties) * 100);
  }
}
