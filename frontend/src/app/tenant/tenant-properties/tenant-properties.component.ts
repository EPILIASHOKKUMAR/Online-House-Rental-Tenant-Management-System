import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenant-properties',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './tenant-properties.component.html',
  styleUrls: ['./tenant-properties.component.css']
})
export class TenantPropertiesComponent {
  
  searchQuery = '';
  selectedLocation = '';
  selectedBudget = '';
  selectedAmenities: string[] = [];

  locations = ['Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Mumbai'];
  budgetRanges = ['5000-10000', '10000-15000', '15000-25000', '25000+'];
  amenities = ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Elevator', 'Garden'];

  properties = [
    { 
      id: 101, 
      title: '2BHK Flat', 
      location: 'Bangalore', 
      rent: 12000, 
      image: 'assets/images/house1.jpg',
      amenities: ['Parking', 'Security', 'Elevator'],
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      description: 'Spacious 2BHK flat in prime location with modern amenities'
    },
    { 
      id: 102, 
      title: '1BHK Apartment', 
      location: 'Hyderabad', 
      rent: 8000, 
      image: 'assets/images/house2.jpg',
      amenities: ['Gym', 'Security', 'Power Backup'],
      bedrooms: 1,
      bathrooms: 1,
      area: 800,
      description: 'Cozy 1BHK apartment perfect for singles or couples'
    },
    { 
      id: 103, 
      title: '3BHK Villa', 
      location: 'Chennai', 
      rent: 25000, 
      image: 'assets/images/house3.jpg',
      amenities: ['Parking', 'Swimming Pool', 'Garden', 'Security'],
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      description: 'Luxurious 3BHK villa with private garden and pool'
    },
    { 
      id: 104, 
      title: 'Studio Room', 
      location: 'Pune', 
      rent: 6000, 
      image: 'assets/images/house1.jpg',
      amenities: ['Security', 'Elevator'],
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      description: 'Compact studio room ideal for students and professionals'
    }
  ];

  filteredProperties = [...this.properties];

  onSearch(): void {
    this.filteredProperties = this.properties.filter(property => {
      const matchesQuery = !this.searchQuery || 
        property.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesLocation = !this.selectedLocation || property.location === this.selectedLocation;
      
      const matchesBudget = !this.selectedBudget || this.checkBudgetRange(property.rent, this.selectedBudget);
      
      const matchesAmenities = this.selectedAmenities.length === 0 || 
        this.selectedAmenities.every(amenity => property.amenities.includes(amenity));

      return matchesQuery && matchesLocation && matchesBudget && matchesAmenities;
    });
  }

  private checkBudgetRange(rent: number, budgetRange: string): boolean {
    switch(budgetRange) {
      case '5000-10000': return rent >= 5000 && rent <= 10000;
      case '10000-15000': return rent >= 10000 && rent <= 15000;
      case '15000-25000': return rent >= 15000 && rent <= 25000;
      case '25000+': return rent >= 25000;
      default: return true;
    }
  }

  onAmenityToggle(amenity: string): void {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index > -1) {
      this.selectedAmenities.splice(index, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
    this.onSearch();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedLocation = '';
    this.selectedBudget = '';
    this.selectedAmenities = [];
    this.filteredProperties = [...this.properties];
  }

  logout(): void {
    localStorage.removeItem('userRole');
    window.location.href = '/';
  }
}