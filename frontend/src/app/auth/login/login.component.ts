import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

declare const google: any;

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
export class LoginComponent implements OnInit, AfterViewInit {
  email: string = '';
  password: string = '';
  ownerEmail: string = '';
  ownerPassword: string = '';
  isOwnerMode: boolean = false;
  
  isLoading: boolean = false;
  errorMessage: string = '';

  private googleClientId = '28520171364-omlp0hrk718c57iglkkuvl60n37ldv0p.apps.googleusercontent.com';
  private googleInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'owner') {
        this.isOwnerMode = true;
      } else if (params['role'] === 'admin') {
        this.router.navigate(['/admin-login']);
      }
    });

    this.loadGoogleScript();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeGoogle(), 500);
  }

  loadGoogleScript(): void {
    if (document.getElementById('google-signin-script')) return;
    
    const script = document.createElement('script');
    script.id = 'google-signin-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogle();
    document.head.appendChild(script);
  }

  initializeGoogle(): void {
    if (typeof google === 'undefined' || !google.accounts) {
      setTimeout(() => this.initializeGoogle(), 100);
      return;
    }

    google.accounts.id.initialize({
      client_id: this.googleClientId,
      callback: (response: any) => this.handleGoogleCallback(response),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    this.googleInitialized = true;
  }

  handleGoogleCallback(response: any): void {
    this.ngZone.run(() => {
      if (response.credential) {
        this.isLoading = true;
        this.errorMessage = '';
        
        const role = this.isOwnerMode ? 'owner' : 'tenant';
        
        this.authService.googleLogin(response.credential, role).subscribe({
          next: (res) => {
            this.isLoading = false;
            const userRole = res.user.role;
            
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
            this.errorMessage = error.error?.error || 'Google login failed';
          }
        });
      }
    });
  }

  onGoogleLogin(): void {
    if (!this.googleInitialized) {
      this.errorMessage = 'Google Sign-In loading... Please try again.';
      this.initializeGoogle();
      return;
    }

    const googleBtnContainer = document.getElementById('google-btn-container');
    if (googleBtnContainer) {
      googleBtnContainer.innerHTML = '';
      google.accounts.id.renderButton(googleBtnContainer, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 280
      });
      const btn = googleBtnContainer.querySelector('div[role="button"]') as HTMLElement;
      if (btn) btn.click();
    } else {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          this.ngZone.run(() => {
            this.openGooglePopup();
          });
        }
      });
    }
  }

  openGooglePopup(): void {
    const redirectUri = window.location.origin;
    const scope = 'email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.googleClientId}&redirect_uri=${redirectUri}&response_type=token id_token&scope=${scope}&nonce=${Date.now()}`;
    
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const popup = window.open(authUrl, 'Google Sign In', `width=${width},height=${height},left=${left},top=${top}`);
    
    if (popup) {
      const checkPopup = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkPopup);
            return;
          }
          if (popup.location.href.includes(redirectUri)) {
            const hash = popup.location.hash;
            popup.close();
            clearInterval(checkPopup);
            
            const params = new URLSearchParams(hash.substring(1));
            const idToken = params.get('id_token');
            
            if (idToken) {
              this.handleGoogleCallback({ credential: idToken });
            }
          }
        } catch (e) {}
      }, 500);
    }
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
