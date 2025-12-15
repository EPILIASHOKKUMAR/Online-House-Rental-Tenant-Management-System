import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-status.html',
  styleUrls: ['./booking-status.css']
})
export class BookingStatusComponent {

  bookingStatus = 'PENDING';

}
