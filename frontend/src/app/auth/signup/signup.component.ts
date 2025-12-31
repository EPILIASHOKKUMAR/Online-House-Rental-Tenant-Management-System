import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';
  
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSignup(): void {
    if (!this.name || !this.email || !this.password || !this.role) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      role: this.role
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Registration successful! Please login.');
        this.router.navigate(['/login'], { queryParams: { role: this.role } });
      },
      error: (error) => {
        this.isLoading = false;
        
        // Handle detailed error message for existing email
        if (error.error?.details) {
          const details = error.error.details;
          this.errorMessage = `${details.message}`;
          
          // Show additional information in an alert
          setTimeout(() => {
            alert(`Email Registration Conflict!\n\nEmail: ${details.email}\nExisting Role: ${details.existingRole}\n\nPlease either:\n1. Use a different email address\n2. Login with your existing credentials\n3. Contact support if this is an error`);
          }, 100);
        } else {
          this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        }
      }
    });
  }
}
