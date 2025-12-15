import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  
  users = [
    { id: 1, name: 'Rahul Kumar', role: 'Tenant', email: 'rahul@mail.com' },
    { id: 2, name: 'Anitha Reddy', role: 'Owner', email: 'anitha@mail.com' },
    { id: 3, name: 'Suresh Babu', role: 'Tenant', email: 'suresh@mail.com' },
    { id: 4, name: 'Priya Sharma', role: 'Owner', email: 'priya@mail.com' },
    { id: 5, name: 'Kiran Rao', role: 'Tenant', email: 'kiran@mail.com' }
  ];

  properties = [
    { id: 101, title: '2BHK Flat', location: 'Bangalore', rent: 12000, ownerId: 'Owner-2' },
    { id: 102, title: '1BHK Apartment', location: 'Hyderabad', rent: 8000, ownerId: 'Owner-4' },
    { id: 103, title: '3BHK Villa', location: 'Chennai', rent: 25000, ownerId: 'Owner-2' },
    { id: 104, title: 'Studio Room', location: 'Pune', rent: 6000, ownerId: 'Owner-4' }
  ];

  userColumns: string[] = ['id', 'name', 'role', 'email'];
  propertyColumns: string[] = ['id', 'title', 'location', 'rent', 'ownerId'];
}
