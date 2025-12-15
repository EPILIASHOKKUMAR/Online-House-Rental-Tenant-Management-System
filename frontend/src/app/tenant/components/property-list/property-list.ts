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

  properties: Property[] = [];
  filteredProperties: Property[] = [];

  location: string = '';
  maxBudget: number | null = null;
  amenity: string = 'All';

  ngOnInit(): void {
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

    // ✅ IMPORTANT: create new array
    this.filteredProperties = [...this.properties];
  }

  filterProperties(): void {

    this.filteredProperties = this.properties.filter(property => {

      // ✅ Location filter (case-insensitive)
      const locationMatch =
        this.location.trim() === '' ||
        property.location.toLowerCase().includes(this.location.toLowerCase());

      // ✅ Budget filter (LESS THAN OR EQUAL)
      const budgetMatch =
        this.maxBudget === null ||
        this.maxBudget === undefined ||
        property.rent <= this.maxBudget;

      // ✅ Amenity filter
      const amenityMatch =
        this.amenity === 'All' ||
        property.amenities.includes(this.amenity);

      return locationMatch && budgetMatch && amenityMatch;
    });
  }

  // Optional reset
  resetFilters(): void {
    this.location = '';
    this.maxBudget = null;
    this.amenity = 'All';
    this.filteredProperties = [...this.properties];
  }
}
