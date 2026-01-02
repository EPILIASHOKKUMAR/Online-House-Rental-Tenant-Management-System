import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-owner-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.css']
})
export class OwnerProfileComponent implements OnInit {
  isSidebarCollapsed = false;

  constructor(private router: Router, private http: HttpClient) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }

  owner = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    profilePhoto: '',
    verified: false
  };

  propertyCount = 0;

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.owner = {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePhoto: user.profile_photo || '',
        verified: false
      };
      this.loadPropertyCount(user.id);
    }
  }

  loadPropertyCount(ownerId: number): void {
    this.http.get<any[]>(`https://online-house-rental-tenant-management.onrender.com/api/properties/owner/${ownerId}`).subscribe({
      next: (properties) => {
        this.propertyCount = properties.length;
      },
      error: () => {
        this.propertyCount = 0;
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const photoData = reader.result as string;
      
      this.http.put(`https://online-house-rental-tenant-management.onrender.com/api/auth/profile/${this.owner.id}/photo`, {
        profile_photo: photoData
      }).subscribe({
        next: () => {
          this.owner.profilePhoto = photoData;
          
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
}
