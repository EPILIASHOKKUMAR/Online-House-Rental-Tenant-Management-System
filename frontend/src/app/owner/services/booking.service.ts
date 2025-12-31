import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  property_id: number;
  tenant_id: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  request_time: string;
  response_time?: string;
  property_title?: string;
  location?: string;
  rent?: number;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) {}

  getOwnerBookings(ownerId: number, status?: string): Observable<Booking[]> {
    let url = `${this.apiUrl}/owner/${ownerId}`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Booking[]>(url);
  }

  updateBookingStatus(id: number, status: 'approved' | 'rejected'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}
