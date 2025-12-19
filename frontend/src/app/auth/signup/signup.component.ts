import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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

  constructor(private router: Router) {}

  onSignup(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log('Signup:', this.name, this.email, this.role);
    localStorage.setItem('userRole', this.role);
    
    if (this.role === 'tenant') {
      this.router.navigate(['/tenant/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
