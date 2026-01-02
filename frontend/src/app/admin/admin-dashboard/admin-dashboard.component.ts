import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/admin';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  isSidebarCollapsed = false;
  isLoading = true;

  totalUsers = 0;
  totalOwners = 0;
  totalTenants = 0;
  totalProperties = 0;
  pendingBookings = 0;
  approvedBookings = 0;
  rejectedBookings = 0;
  availableProperties = 0;

  recentActivities: any[] = [];

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentActivity();
  }

  loadStats(): void {
    this.http.get<any>(`${this.apiUrl}/stats`).subscribe({
      next: (stats) => {
        this.totalUsers = stats.totalUsers;
        this.totalOwners = stats.totalOwners;
        this.totalTenants = stats.totalTenants;
        this.totalProperties = stats.totalProperties;
        this.pendingBookings = stats.pendingBookings;
        this.approvedBookings = stats.approvedBookings;
        this.rejectedBookings = stats.rejectedBookings;
        this.availableProperties = stats.availableProperties;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.isLoading = false;
      }
    });
  }

  loadRecentActivity(): void {
    this.http.get<any[]>(`${this.apiUrl}/users`).subscribe({
      next: (users) => {
        this.recentActivities = users.slice(0, 5).map(user => ({
          type: user.role === 'owner' ? 'property' : 'user',
          icon: user.role === 'owner' ? 'business' : 'person_add',
          title: `New ${user.role} Registration`,
          description: `${user.name} registered as ${user.role}`,
          time: this.formatDate(user.created_at)
        }));
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
