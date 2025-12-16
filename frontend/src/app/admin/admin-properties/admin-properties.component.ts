import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './admin-properties.component.html',
  styleUrls: ['./admin-properties.component.css']
})
export class AdminPropertiesComponent {
  
  properties = [
    { id: 101, title: '2BHK Flat', location: 'Bangalore', rent: 12000, ownerId: 'Owner-2' },
    { id: 102, title: '1BHK Apartment', location: 'Hyderabad', rent: 8000, ownerId: 'Owner-4' },
    { id: 103, title: '3BHK Villa', location: 'Chennai', rent: 25000, ownerId: 'Owner-2' },
    { id: 104, title: 'Studio Room', location: 'Pune', rent: 6000, ownerId: 'Owner-4' }
  ];

  propertyColumns: string[] = ['id', 'title', 'location', 'rent', 'ownerId'];

  logout(): void {
    localStorage.removeItem('userRole');
    window.location.href = '/';
  }
}
