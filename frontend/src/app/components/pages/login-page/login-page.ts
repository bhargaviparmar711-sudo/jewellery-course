import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    // Reset error message
    this.errorMessage = '';

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;

    // Use AuthService for mock login (frontend only)
    setTimeout(() => {
      this.isLoading = false;
      const result = this.authService.login(this.email, this.password, this.rememberMe);
      
      if (result.success && result.user) {
        // Navigate based on user role
        if (result.user.role === 'admin') {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.router.navigateByUrl('/');
        }
      } else {
        this.errorMessage = result.message || 'Login failed';
      }
    }, 1500); // Simulate API delay
  }

  socialLogin(provider: string) {
    // Placeholder for social login
    alert(`${provider} login coming soon!`);
  }

  forgotPassword() {
    // Placeholder for forgot password
    alert('Password reset link will be sent to your email!');
  }
}
