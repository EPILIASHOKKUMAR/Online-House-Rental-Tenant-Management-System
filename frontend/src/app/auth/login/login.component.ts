import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
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
  }

  onLogin(role: string): void {
    console.log('Login as:', role);
    localStorage.setItem('userRole', role);
    
    if (role === 'tenant') {
      this.router.navigate(['/tenant/dashboard']);
    } else if (role === 'owner') {
      this.router.navigate(['/']);
    }
  }
}
