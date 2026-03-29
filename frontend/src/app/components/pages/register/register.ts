import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-box">
        <h1>🏆 Noor Jewellers - Register</h1>
        <p>Create your account to start shopping!</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="input-group">
            <input type="text" placeholder="Full Name" [(ngModel)]="name" name="name" required class="form-input" />
          </div>
          <div class="input-group">
            <input type="email" placeholder="Email" [(ngModel)]="email" name="email" required class="form-input" />
          </div>
          <div class="input-group">
            <input type="password" placeholder="Password" [(ngModel)]="password" name="password" required class="form-input" />
          </div>
          
          <button type="submit" class="register-btn">Create Account</button>
        </form>
        
        <p class="login-link">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .register-box {
      background: white;
      padding: 40px;
      border-radius: 20px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .register-box h1 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 1.8rem;
    }
    
    .input-group {
      margin-bottom: 20px;
    }
    
    .form-input {
      width: 100%;
      padding: 15px;
      border: 2px solid #e1e1e1;
      border-radius: 12px;
      font-size: 1rem;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .register-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      cursor: pointer;
    }
    
    .login-link {
      margin-top: 20px;
    }
    
    .login-link a {
      color: #667eea;
      text-decoration: none;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  onSubmit() {
    alert('Registration feature coming soon! Please use demo login: admin@noorjewellers.com / admin123');
  }
}

