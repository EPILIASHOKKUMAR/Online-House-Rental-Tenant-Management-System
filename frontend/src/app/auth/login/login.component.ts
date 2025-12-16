import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  role: string = 'tenant';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.role = params['role'];
      }
    });
  }

  getLoginTitle(): string {
    return this.role.charAt(0).toUpperCase() + this.role.slice(1) + ' Login';
  }

  onLogin() {
    console.log('Login clicked:', this.email, 'Role:', this.role);
    
    localStorage.setItem('userRole', this.role);
    
    if (this.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.role === 'tenant') {
      this.router.navigate(['/properties']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
