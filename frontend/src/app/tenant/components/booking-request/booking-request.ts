import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-booking-request',
  standalone: true,
  templateUrl: './booking-request.html',
  styleUrls: ['./booking-request.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class BookingRequestComponent implements OnInit {

  private apiUrl = 'https://online-house-rental-tenant-management.onrender.com/api';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  propertyId = 0;
  property: any = null;
  isLoading = true;
  isSubmitting = false;
  submitted = false;
  errorMessage = '';

  booking = {
    tenantName: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: ''
  };

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProperty();
    this.loadUserData();
  }

  loadProperty(): void {
    this.http.get(`${this.apiUrl}/properties/${this.propertyId}`).subscribe({
      next: (property) => {
        this.property = property;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.isLoading = false;
      }
    });
  }

  loadUserData(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.booking.tenantName = userData.name || '';
      this.booking.email = userData.email || '';
      this.booking.phone = userData.phone || '';
    }
  }

  submitBooking(): void {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      this.errorMessage = 'Please login first';
      return;
    }

    const userData = JSON.parse(user);

    const bookingData = {
      property_id: this.propertyId,
      tenant_id: userData.id,
      message: this.booking.message || `Move-in date: ${this.booking.moveInDate}`
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.http.post(`${this.apiUrl}/bookings`, bookingData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitted = true;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.error || 'Failed to submit booking request';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tenant/properties']);
  }
}
