import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Property {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  rent: number;
  location: string;
  city: string;
  state: string;
  amenities: string[];
  photos: string[];
  status: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/properties';

  constructor(private http: HttpClient) {}

  getAllProperties(filters?: { location?: string; maxBudget?: number; amenity?: string }): Observable<Property[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (filters?.location) params.push(`location=${filters.location}`);
    if (filters?.maxBudget) params.push(`maxBudget=${filters.maxBudget}`);
    if (filters?.amenity) params.push(`amenity=${filters.amenity}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Property[]>(url);
  }

  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  getPropertiesByOwner(ownerId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  createProperty(property: Partial<Property>): Observable<any> {
    return this.http.post(this.apiUrl, property);
  }

  updateProperty(id: number, property: Partial<Property>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, property);
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
