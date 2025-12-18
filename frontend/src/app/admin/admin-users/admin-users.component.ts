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
  selector: 'app-admin-users',
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
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  
  users = [
    { id: 1, name: 'E.ASHOK KUMAR', role: 'Tenant', email: 'Ashok@mail.com' },
    { id: 2, name: 'VISHNU', role: 'Owner', email: 'vishnu@mail.com' },
    { id: 3, name: 'Santhosh', role: 'Tenant', email: 'Santhosh@mail.com' },
    { id: 4, name: 'Chaitrika', role: 'Owner', email: 'Chaitrikha@mail.com' },
    { id: 5, name: 'Sudhavali', role: 'Tenant', email: 'Sudhavalli@mail.com' }
  ];

  userColumns: string[] = ['id', 'name', 'role', 'email'];

  getRoleIcon(role: string): string {
    return role === 'Tenant' ? 'person' : 'business';
  }

  logout(): void {
    localStorage.removeItem('userRole');
    window.location.href = '/';
  }
}
