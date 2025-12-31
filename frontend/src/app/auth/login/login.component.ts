import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  ownerEmail: string = '';
  ownerPassword: string = '';
  isOwnerMode: boolean = false;
  
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'owner') {
        this.isOwnerMode = true;
      } else if (params['role'] === 'admin') {
        this.router.navigate(['/admin-login']);
      }
    });
  }

  toggleMode(): void {
    this.isOwnerMode = !this.isOwnerMode;
    this.errorMessage = '';
  }

  setMode(isOwner: boolean): void {
    this.isOwnerMode = isOwner;
    this.errorMessage = '';
  }

  onLogin(role: string): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        const userRole = response.user.role;
        
        if (role === 'owner' && userRole !== 'owner') {
          this.errorMessage = `This account is registered as "${userRole}". Please click the ${userRole === 'tenant' ? 'Tenant' : 'correct'} tab to login.`;
          this.authService.logout();
          return;
        }
        
        if (role === 'tenant' && userRole !== 'tenant') {
          this.errorMessage = `This account is registered as "${userRole}". Please click the ${userRole === 'owner' ? 'Owner' : 'correct'} tab to login.`;
          this.authService.logout();
          return;
        }

        if (userRole === 'tenant') {
          this.router.navigate(['/tenant/dashboard']);
        } else if (userRole === 'owner') {
          this.router.navigate(['/owner/dashboard']);
        } else if (userRole === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Invalid email or password';
      }
    });
  }
}
