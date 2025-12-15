import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  templateUrl: './property-details.html',
  styleUrls: ['./property-details.css']
})
export class PropertyDetailsComponent implements OnInit {

  property!: Property;

  private properties: Property[] = [
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.property = this.properties.find(p => p.id === id)!;
  }
}
