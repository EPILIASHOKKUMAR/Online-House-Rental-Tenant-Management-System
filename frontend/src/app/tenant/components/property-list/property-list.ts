import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyListComponent implements OnInit {

  /* ================= DATA ================= */

  properties: Property[] = [];
  filteredProperties: Property[] = [];

  /* ================= FILTER MODEL ================= */

  location: string = '';
  maxBudget: number | null = null;

  // ✅ IMPORTANT FIX
  amenity: string | null = null;

  /* ================= LIFECYCLE ================= */

  ngOnInit(): void {
    this.loadProperties();
  }

  /* ================= METHODS ================= */

  loadProperties(): void {
    this.properties = [
      {
        id: 1,
        title: '2BHK Apartment',
        location: 'Hyderabad',
        rent: 15000,
        amenities: ['Parking', 'Lift'],
        image: 'assets/images/house1.jpg'
      },
      {
        id: 2,
        title: '1BHK Flat',
        location: 'Bangalore',
        rent: 12000,
        amenities: ['Power Backup'],
        image: 'assets/images/house2.jpg'
      },
      {
        id: 3,
        title: '3BHK Villa',
        location: 'Chennai',
        rent: 25000,
        amenities: ['Parking', 'Garden'],
        image: 'assets/images/house3.jpg'
      }
    ];

    this.filteredProperties = [...this.properties];
  }

  filterProperties(): void {
    this.filteredProperties = this.properties.filter(property => {

      const locationMatch =
        !this.location ||
        property.location
          .toLowerCase()
          .includes(this.location.trim().toLowerCase());

      const budgetMatch =
        this.maxBudget === null ||
        property.rent <= this.maxBudget;

      // ✅ CORRECT LOGIC
      const amenityMatch =
        !this.amenity ||
        property.amenities.includes(this.amenity);

      return locationMatch && budgetMatch && amenityMatch;
    });
  }

  resetFilters(): void {
    this.location = '';
    this.maxBudget = null;
    this.amenity = null; // ✅ reset correctly
    this.filteredProperties = [...this.properties];
  }
}
