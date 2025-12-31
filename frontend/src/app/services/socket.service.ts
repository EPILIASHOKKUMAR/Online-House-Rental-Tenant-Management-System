import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

export interface BookingStatusUpdate {
  bookingId: number;
  status: string;
  propertyTitle: string;
  message: string;
}

export interface NewBookingNotification {
  bookingId: number;
  propertyId: number;
  tenantId: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private bookingStatusSubject = new Subject<BookingStatusUpdate>();
  private newBookingSubject = new Subject<NewBookingNotification>();

  bookingStatusUpdate$ = this.bookingStatusSubject.asObservable();
  newBooking$ = this.newBookingSubject.asObservable();

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.joinUserRoom();
    });

    this.socket.on('booking-status-update', (data: BookingStatusUpdate) => {
      console.log('Booking status update received:', data);
      this.bookingStatusSubject.next(data);
    });

    this.socket.on('new-booking', (data: NewBookingNotification) => {
      console.log('New booking notification received:', data);
      this.newBookingSubject.next(data);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  private joinUserRoom(): void {
    const user = localStorage.getItem('currentUser');
    if (user && this.socket) {
      const userData = JSON.parse(user);
      if (userData.role === 'tenant') {
        this.socket.emit('join-tenant', userData.id);
      } else if (userData.role === 'owner') {
        this.socket.emit('join-owner', userData.id);
      }
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
