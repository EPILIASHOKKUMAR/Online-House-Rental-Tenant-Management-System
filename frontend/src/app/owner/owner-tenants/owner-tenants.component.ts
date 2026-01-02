import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  property_title: string;
  location: string;
  rent: number;
  booking_date: string;
}

@Component({
  selector: 'app-owner-tenants',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './owner-tenants.component.html',
  styleUrls: ['./owner-tenants.component.css']
})
export class OwnerTenantsComponent implements OnInit {

  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/bookings';

  isSidebarCollapsed = false;
  tenants: Tenant[] = [];
  isLoading = true;
  userId = 0;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.loadTenants();
    }
  }

  loadTenants(): void {
    this.http.get<any[]>(`${this.apiUrl}/owner/${this.userId}?status=approved`).subscribe({
      next: (bookings) => {
        this.tenants = bookings.map(b => ({
          id: b.tenant_id,
          name: b.tenant_name,
          email: b.tenant_email,
          phone: b.tenant_phone,
          property_title: b.property_title,
          location: b.location,
          rent: b.rent,
          booking_date: b.response_time || b.request_time
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.isLoading = false;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
