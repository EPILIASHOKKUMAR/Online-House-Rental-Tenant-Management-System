import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent {

  isSidebarCollapsed = false;

  settings = {
    siteName: 'House Rental System',
    contactEmail: 'admin@houserental.com',
    contactPhone: '+91 9876543210',
    allowRegistration: true,
    requireApproval: false,
    maxPhotosPerProperty: 10,
    maintenanceMode: false
  };

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  saveSettings(): void {
    alert('Settings saved successfully!');
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
