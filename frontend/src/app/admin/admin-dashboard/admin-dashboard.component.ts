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
    { id: 1, name: 'E.ASHOK KUMAR', role: 'Tenant', email: 'Ashok@mail.com' },
    { id: 2, name: 'VISHNU', role: 'Owner', email: 'vishnu@mail.com' },
    { id: 3, name: 'Santhosh', role: 'Tenant', email: 'Santhosh@mail.com' },
    { id: 4, name: 'Chaitrika', role: 'Owner', email: 'Chaitrikha@mail.com' },
    { id: 5, name: 'Sudhavali', role: 'Tenant', email: 'Sudhavalli@mail.com' }
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
