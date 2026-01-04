import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-owner-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.css']
})
export class OwnerProfileComponent implements OnInit {
  isSidebarCollapsed = false;
  isEditMode = false;
  isUpdating = false;
  isChangePasswordMode = false;
  isChangingPassword = false;

  constructor(private router: Router, private http: HttpClient) {}

  owner = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    profilePhoto: '',
    verified: false
  };

  editOwner = {
    name: '',
    phone: ''
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.editOwner = {
        name: this.owner.name,
        phone: this.owner.phone
      };
    }
  }

  saveProfile(): void {
    if (!this.editOwner.name.trim()) {
      alert('Name is required');
      return;
    }

    this.isUpdating = true;

    this.http.put(`https://online-house-rental-tenant-management.onrender.com/api/auth/profile/${this.owner.id}`, {
      name: this.editOwner.name.trim(),
      phone: this.editOwner.phone.trim()
    }).subscribe({
      next: (response: any) => {
        this.owner.name = this.editOwner.name.trim();
        this.owner.phone = this.editOwner.phone.trim();
        
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          user.name = this.owner.name;
          user.phone = this.owner.phone;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        this.isEditMode = false;
        this.isUpdating = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        this.isUpdating = false;
        console.error('Profile update error:', error);
        
        let errorMessage = 'Failed to update profile. Please try again.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editOwner = {
      name: this.owner.name,
      phone: this.owner.phone
    };
  }

  toggleChangePasswordMode(): void {
    this.isChangePasswordMode = !this.isChangePasswordMode;
    if (this.isChangePasswordMode) {
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }

  changePassword(): void {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      alert('All password fields are required');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    this.isChangingPassword = true;

    this.http.put(`https://online-house-rental-tenant-management.onrender.com/api/auth/change-password/${this.owner.id}`, {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    }).subscribe({
      next: (response: any) => {
        this.isChangingPassword = false;
        this.isChangePasswordMode = false;
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        alert('Password changed successfully!');
      },
      error: (error) => {
        this.isChangingPassword = false;
        console.error('Password change error:', error);
        
        let errorMessage = 'Failed to change password. Please try again.';
        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  cancelChangePassword(): void {
    this.isChangePasswordMode = false;
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
