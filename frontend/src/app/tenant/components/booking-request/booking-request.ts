import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-request.html',
  styleUrls: ['./booking-request.css']
})
export class BookingRequestComponent implements OnInit {

  booking!: Booking;
  submitted = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const propertyId = Number(this.route.snapshot.paramMap.get('id'));

    this.booking = {
      propertyId,
      tenantName: '',
      email: '',
      phone: '',
      moveInDate: '',
      message: '',
      status: 'PENDING'
    };
  }

  submitBooking(): void {
    console.log('Booking Request Submitted:', this.booking);
    this.submitted = true;
  }
}
