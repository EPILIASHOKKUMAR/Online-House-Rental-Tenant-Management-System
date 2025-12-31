import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  private apiUrl = 'http://localhost:3000/api/admin';

  isSidebarCollapsed = false;
  isLoading = true;
  users: User[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/users/${userId}`).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        error: (error) => {
          alert(error.error?.error || 'Failed to delete user');
        }
      });
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN');
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
