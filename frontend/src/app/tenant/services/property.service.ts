import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private properties: Property[] = [
    {
      id: 1,
      title: '2BHK Apartment',
      location: 'Hyderabad',
      rent: 15000,
      amenities: ['Parking', 'Lift', 'Power Backup'],
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      title: '1BHK Flat',
      location: 'Bangalore',
      rent: 12000,
      amenities: ['Parking'],
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 3,
      title: '3BHK Villa',
      location: 'Chennai',
      rent: 25000,
      amenities: ['Parking', 'Garden', 'Security'],
      image: 'https://via.placeholder.com/300'
    }
  ];

  getAllProperties(): Observable<Property[]> {
    return of(this.properties);
  }

  getPropertyById(id: number): Observable<Property | undefined> {
    return of(this.properties.find(p => p.id === id));
  }
}
