import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  resetToken: string = '';
  showResetForm: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onForgotPassword(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        
        // For development - show reset token (remove in production)
        if (response.resetToken) {
          this.resetToken = response.resetToken;
          this.showResetForm = true;
          this.successMessage += ` Your reset token is: ${response.resetToken}`;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to send reset instructions. Please try again.';
      }
    });
  }

  onResetPassword(): void {
    if (!this.resetToken || !this.newPassword) {
      this.errorMessage = 'Please enter reset token and new password';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.resetToken, this.newPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Password reset successful! You can now login with your new password.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Failed to reset password. Please try again.';
      }
    });
  }
}