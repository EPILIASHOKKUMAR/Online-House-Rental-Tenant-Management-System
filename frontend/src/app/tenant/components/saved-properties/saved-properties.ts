import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

interface Property {
  id: number;
  title: string;
  location: string;
  city: string;
  rent: number;
  property_type: string;
  bhk: string;
  photos: string[];
  owner_name: string;
}

@Component({
  selector: 'app-saved-properties',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './saved-properties.html',
  styleUrls: ['./saved-properties.css']
})
export class SavedPropertiesComponent implements OnInit {

  isSidebarCollapsed = false;
  savedProperties: Property[] = [];
  isLoading = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSavedProperties();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  loadSavedProperties(): void {
    const saved = localStorage.getItem('savedProperties');
    if (saved) {
      const savedIds = JSON.parse(saved);
      if (savedIds.length > 0) {
        this.isLoading = true;
        this.http.get<Property[]>('https://online-house-rental-tenant-management.onrender.com/api/properties').subscribe({
          next: (properties) => {
            this.savedProperties = properties.filter(p => savedIds.includes(p.id)).map(p => ({
              ...p,
              photos: typeof p.photos === 'string' ? JSON.parse(p.photos) : p.photos || []
            }));
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
    }
  }

  removeFromSaved(propertyId: number): void {
    const saved = localStorage.getItem('savedProperties');
    if (saved) {
      let savedIds = JSON.parse(saved);
      savedIds = savedIds.filter((id: number) => id !== propertyId);
      localStorage.setItem('savedProperties', JSON.stringify(savedIds));
      this.savedProperties = this.savedProperties.filter(p => p.id !== propertyId);
    }
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
