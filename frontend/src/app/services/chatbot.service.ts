import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
  response: string;
  stats?: {
    totalProperties: number;
    availableProperties: number;
  };
}

export interface ChatStats {
  totalProperties: number;
  availableProperties: number;
  propertiesByCity: { city: string; count: number }[];
  propertiesByType: { property_type: string; count: number }[];
  usersByRole: { role: string; count: number }[];
  bookingStats: { status: string; count: number }[];
  priceRange: { min: number; max: number; avg: number };
  recentProperties: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, { message });
  }

  getStats(): Observable<ChatStats> {
    return this.http.get<ChatStats>(`${this.apiUrl}/stats`);
  }
}
