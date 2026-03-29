import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>🏆 Noor Jewellers Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ user?.name }}!</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>
      
      <div class="dashboard-stats" *ngIf="isAdmin">
        <div class="stat-card">
          <h3>Total Products</h3>
          <span class="stat-number">150+</span>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <span class="stat-number">245</span>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <span class="stat-number">$125,430</span>
        </div>
      </div>
      
      <div class="quick-actions">
        <a routerLink="/" class="action-link">👁️ View Store</a>
        <a routerLink="/cart-page" class="action-link">🛒 My Cart</a>
        <a routerLink="/admin" class="action-link" *ngIf="isAdmin">⚙️ Admin Panel</a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 40px 20px;
    }
    
    .dashboard-header {
      max-width: 1200px;
      margin: 0 auto 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .dashboard-header h1 {
      color: #667eea;
      font-size: 2.5rem;
      margin: 0;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .logout-btn {
      background: #ff4757;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .dashboard-stats {
      max-width: 1200px;
      margin: 0 auto 40px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .stat-card {
      background: white;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-card h3 {
      color: #666;
      margin-bottom: 10px;
      font-size: 1.1rem;
    }
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
      display: block;
    }
    
    .quick-actions {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .action-link {
      padding: 15px 30px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .action-link:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    
    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null;
  isAdmin = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
  }
}

