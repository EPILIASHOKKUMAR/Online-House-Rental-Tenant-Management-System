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
  photos?: string[];
  owner_name?: string;
  owner_phone?: string;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(booking: { property_id: number; tenant_id: number; message?: string }): Observable<any> {
    return this.http.post(this.apiUrl, booking);
  }

  getTenantBookings(tenantId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/tenant/${tenantId}`);
  }

  getOwnerBookings(ownerId: number, status?: string): Observable<Booking[]> {
    let url = `${this.apiUrl}/owner/${ownerId}`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Booking[]>(url);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  updateBookingStatus(id: number, status: 'approved' | 'rejected'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
