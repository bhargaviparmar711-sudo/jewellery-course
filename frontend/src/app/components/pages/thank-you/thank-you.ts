import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order';
import { Order, Address } from '../../../../shared/models/order';
import { AuthService } from '../../../services/auth';
import { Title } from "../../../components/partials/title/title";
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, NgIf, RouterLink, Title],
  styleUrls: ['./thank-you.css'],
  template: `
    <app-title title="Order Confirmation" margin="2rem 0 0 0"></app-title>
    
    <div class="thank-you-page">
      <div class="container">
        <div class="thank-you-content">
          <div class="success-icon">✅</div>
          <h1>Thank You for Your Order!</h1>
          <p class="subtitle">Your order has been placed successfully. We'll send you a confirmation email shortly.</p>
          
          <div class="order-details-card">
            <h2>Order #{{ orderId }}</h2>
            <div class="order-info">
              <div class="info-row">
                <span class="label">Order Date:</span>
                <span class="value">{{ orderDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">Status:</span>
                <span class="badge pending">{{ orderStatus }}</span>
              </div>
              <div class="info-row">
                <span class="label">Total Amount:</span>
                <span class="value large">₹{{ orderTotal }}</span>
              </div>
            </div>
          </div>
          
          <ng-container *ngIf="order">
            <div class="receipt-section">
              <h3>📋 Order Receipt</h3>
              
              <div class="delivery-info">
                <h4>Delivery To:</h4>
                <p class="address">
                  {{ order.address.name }}<br>
                  {{ order.address.street }}<br>
                  {{ order.address.city }}, {{ order.address.state }} {{ order.address.zip }}<br>
                  Phone: {{ order.address.phone }}
                </p>
              </div>
              
              <div class="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of order.items">
                      <td>{{ item.jewellery.name }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>₹{{ item.jewellery.price }}</td>
                      <td>₹{{ item.price * item.quantity }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="total-summary">
                <div class="total-row">
                  <span>Total: ₹{{ order.total }}</span>
                </div>
              </div>
            </div>
          </ng-container>
          
          <div class="next-steps">
            <a routerLink="/dashboard" class="btn btn-primary">View Orders</a>
            <a routerLink="/" class="btn btn-secondary">Continue Shopping</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .thank-you-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem 0;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .thank-you-content {
      text-align: center;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
      padding: 3rem 2rem;
    }
    
    .success-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 0.6s ease-out;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
    
    .thank-you-content h1 {
      font-size: 2.5rem;
      color: #28a745;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 3rem;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }
    
    .order-details-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 2rem;
    }
    
    .order-details-card h2 {
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      align-items: center;
    }
    
    .label {
      opacity: 0.9;
      font-weight: 500;
    }
    
    .value {
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .large {
      font-size: 1.5rem !important;
    }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .badge.pending {
      background: rgba(255,193,7,0.2);
      color: #ffc107;
      border: 1px solid rgba(255,193,7,0.3);
    }
    
    .receipt-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    
    .receipt-section h3 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
      position: relative;
    }
    
    .receipt-section h3::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 2px;
    }
    
    .delivery-info {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .delivery-info h4 {
      margin-bottom: 1rem;
      color: #28a745;
    }
    
    .address {
      margin: 0;
      line-height: 1.6;
      color: #333;
      font-size: 1rem;
    }
    
    .items-table table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }
    
    .items-table th,
    .items-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    
    .items-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }
    
    .total-summary {
      text-align: right;
      padding-top: 1rem;
      border-top: 2px solid #dee2e6;
    }
    
    .total-row {
      font-size: 1.3rem;
      font-weight: 700;
      color: #28a745;
    }
    
    .next-steps {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.3s;
      display: inline-block;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102,126,234,0.4);
    }
    
    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }
    
    .btn-secondary:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
      .thank-you-content {
        padding: 2rem 1rem;
        margin: 1rem;
      }
      
      .next-steps {
        flex-direction: column;
      }
      
      .btn {
        width: 100%;
      }
      
      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }
  `]
})
export class ThankYouComponent implements OnInit {
  orderId!: string;
  order: Order | null = null;
  orderDate = '';
  orderStatus = '';
  orderTotal = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
    
    // Check for order in router state (passed from checkout)
    const navigation = this.router.getCurrentNavigation();
    const stateOrder = (navigation?.extras as any)?.state?.order;
    if (stateOrder) {
      this.order = stateOrder;
      this.orderTotal = stateOrder.total || 0;
    } else if (this.orderId) {
      this.loadOrder();
    }
    
    const today = new Date().toLocaleDateString('en-IN');
    this.orderDate = today;
    this.orderStatus = 'Pending';
  }

  loadOrder(): void {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      this.toastService.showError('Please login to view order');
      return;
    }

    this.orderService.getUserOrders(userId).subscribe({
      next: (orders: Order[]) => {
        this.order = orders.find(o => o.id === this.orderId) || null;
        if (this.order) {
          this.orderTotal = this.order.total;
        } else {
          this.toastService.showError('Order not found');
        }
      },
      error: () => {
        this.toastService.showError('Failed to load order details');
      }
    });
  }
}

