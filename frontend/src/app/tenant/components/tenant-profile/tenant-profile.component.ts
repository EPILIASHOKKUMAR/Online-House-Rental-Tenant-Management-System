import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tenant-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './tenant-profile.component.html',
  styleUrls: ['./tenant-profile.component.css']
})
export class TenantProfileComponent implements OnInit {
  isSidebarCollapsed = false;

  constructor(private router: Router, private http: HttpClient) {}

  tenant = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    profilePhoto: '',
    verified: false
  };

  bookingCount = 0;
  approvedCount = 0;

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.tenant = {
        id: user.id,
        name: user.name || 'Tenant',
        email: user.email || '',
        phone: user.phone || '',
        profilePhoto: user.profile_photo || '',
        verified: false
      };
      this.loadBookingStats(user.id);
    }
  }

  loadBookingStats(userId: number): void {
    this.http.get<any[]>(`http://localhost:3000/api/bookings/tenant/${userId}`).subscribe({
      next: (bookings) => {
        this.bookingCount = bookings.length;
        this.approvedCount = bookings.filter(b => b.status === 'approved').length;
      },
      error: () => {}
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const photoData = reader.result as string;
      
      this.http.put(`http://localhost:3000/api/auth/profile/${this.tenant.id}/photo`, {
        profile_photo: photoData
      }).subscribe({
        next: () => {
          this.tenant.profilePhoto = photoData;
          
          const userData = localStorage.getItem('currentUser');
          if (userData) {
            const user = JSON.parse(userData);
            user.profile_photo = photoData;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        },
        error: () => {
          alert('Failed to update profile photo');
        }
      });
    };
    
    reader.readAsDataURL(file);
    input.value = '';
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
