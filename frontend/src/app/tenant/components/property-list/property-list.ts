import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  city: string;
  rent: number;
  property_type: string;
  bhk: string;
  furnishing: string;
  amenities: string[];
  photos: string[];
  status: string;
  owner_name: string;
  isBooked: boolean;
}

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MaterialModule, MatIconModule],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyListComponent implements OnInit {

  private apiUrl = 'http://localhost:3000/api/properties';

  constructor(private http: HttpClient, private router: Router) {}

  isSidebarCollapsed = false;
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  isLoading = true;

  location: string = '';
  maxBudget: number | null = null;
  amenity: string | null = null;

  ngOnInit(): void {
    this.loadProperties();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  loadProperties(): void {
    this.isLoading = true;
    this.http.get<Property[]>(this.apiUrl).subscribe({
      next: (properties) => {
        this.properties = properties.map(p => ({
          ...p,
          amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities || [],
          photos: typeof p.photos === 'string' ? JSON.parse(p.photos) : p.photos || []
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

  filterProperties(): void {
    this.filteredProperties = this.properties.filter(property => {
      const locationMatch = !this.location ||
        property.location?.toLowerCase().includes(this.location.trim().toLowerCase()) ||
        property.city?.toLowerCase().includes(this.location.trim().toLowerCase());

      const budgetMatch = this.maxBudget === null || property.rent <= this.maxBudget;

      const amenityMatch = !this.amenity || property.amenities?.includes(this.amenity);

      return locationMatch && budgetMatch && amenityMatch;
    });
  }

  resetFilters(): void {
    this.location = '';
    this.maxBudget = null;
    this.amenity = null;
    this.filteredProperties = [...this.properties];
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
