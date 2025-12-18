import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Live Snapshot Data
  availableHouses = 0;
  pendingBookings = 0;
  recentProperties = 0;

  ngOnInit() {
    // Animate numbers on load
    this.animateValue('availableHouses', 24);
    this.animateValue('pendingBookings', 8);
    this.animateValue('recentProperties', 5);
  }

  private animateValue(property: 'availableHouses' | 'pendingBookings' | 'recentProperties', target: number) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        this[property] = target;
        clearInterval(timer);
      } else {
        this[property] = Math.floor(current);
      }
    }, duration / steps);
  }
}
