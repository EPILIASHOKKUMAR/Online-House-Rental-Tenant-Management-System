import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  rent: number;
  photos: string[];
  amenities: string[];
  status: string;
  pending_requests: number;
  created_at: string;
}

@Component({
  selector: 'app-owner-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './owner-properties.component.html',
  styleUrls: ['./owner-properties.component.css']
})
export class OwnerPropertiesComponent implements OnInit {

  private apiUrl = 'http://localhost:3000/api/properties';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  isSidebarCollapsed = false;
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  isLoading = true;
  userId = 0;

  searchText = '';
  statusFilter = 'all';
  sortBy = 'newest';

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.loadProperties();
    }
  }

  loadProperties(): void {
    this.http.get<Property[]>(`${this.apiUrl}/owner/${this.userId}`).subscribe({
      next: (properties) => {
        this.properties = properties.map(p => ({
          ...p,
          photos: typeof p.photos === 'string' ? JSON.parse(p.photos) : p.photos || [],
          amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities || []
        }));
        this.filteredProperties = [...this.properties];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.isLoading = false;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  get totalProperties(): number {
    return this.properties.length;
  }

  get availableCount(): number {
    return this.properties.filter(p => p.status === 'available').length;
  }

  get occupiedCount(): number {
    return this.properties.filter(p => p.status === 'rented').length;
  }

  applyFilters(): void {
    let data = [...this.properties];

    if (this.searchText.trim()) {
      const t = this.searchText.toLowerCase();
      data = data.filter(p =>
        p.title.toLowerCase().includes(t) ||
        p.location.toLowerCase().includes(t) ||
        p.city?.toLowerCase().includes(t)
      );
    }

    if (this.statusFilter !== 'all') {
      data = data.filter(p => p.status === this.statusFilter);
    }

    switch (this.sortBy) {
      case 'rentHigh':
        data.sort((a, b) => b.rent - a.rent);
        break;
      case 'rentLow':
        data.sort((a, b) => a.rent - b.rent);
        break;
      case 'titleAZ':
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleZA':
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    this.filteredProperties = data;
  }

  resetFilters(): void {
    this.searchText = '';
    this.statusFilter = 'all';
    this.sortBy = 'newest';
    this.filteredProperties = [...this.properties];
  }

  deleteProperty(id: number): void {
    if (confirm('Are you sure you want to delete this property?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          alert('Property deleted successfully');
          this.loadProperties();
        },
        error: (error) => {
          alert('Failed to delete property');
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
