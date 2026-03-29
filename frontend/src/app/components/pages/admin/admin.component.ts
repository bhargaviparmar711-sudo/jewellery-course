import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JewelleryService } from '../../../services/jewellery';
import { OrderService } from '../../../services/order';
import { Jewellery } from '../../../../shared/models/jewellery';
import { Order } from '../../../../shared/models/order';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>⚙️ Admin Panel - Noor Jewellers</h1>
        <a routerLink="/dashboard" class="back-btn">← Back to Dashboard</a>
      </div>

      <div class="tabs">
        <button class="tab-btn active" (click)="setTab('products')">Products ({{ jewelleryList.length }})</button>
        <button class="tab-btn" (click)="setTab('orders')">Orders ({{ orders.length }})</button>
      </div>

      <!-- Products Tab -->
      <div class="tab-content" *ngIf="activeTab === 'products'">
        <div class="section-header">
          <h2>Manage Products</h2>
          <button class="add-btn" (click)="showForm = !showForm">+ Add New Product</button>
        </div>

        <!-- Add/Edit Form -->
        <div class="form-container" *ngIf="showForm">
          <h3>{{ editingId ? 'Edit Product' : 'Add New Product' }}</h3>
          <form (ngSubmit)="onSubmit()">
            <input [(ngModel)]="formData.name" name="name" placeholder="Product Name" required>
            <input [(ngModel)]="formData.price" name="price" type="number" placeholder="Price" required>
            <input [(ngModel)]="formData.imageUrl" name="imageUrl" placeholder="Image URL">
            <input [(ngModel)]="formData.tags" name="tags" placeholder="Tags (comma separated)">
            <textarea [(ngModel)]="formData.origins" name="origins" placeholder="Origins"></textarea>
            <label>
              <input type="checkbox" [(ngModel)]="formData.favorite" name="favorite">
              Favorite
            </label>
            <label>
              <input type="number" [(ngModel)]="formData.stars" name="stars" min="0" max="5" step="0.1">
              Stars (0-5)
            </label>
            <button type="submit" class="save-btn">{{ editingId ? 'Update' : 'Add' }}</button>
            <button type="button" class="cancel-btn" (click)="cancelEdit()">Cancel</button>
          </form>
        </div>

        <!-- Products Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Tags</th>
                <th>Stars</th>
                <th>Fav</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of jewelleryList">
                <td><img [src]="item.imageUrl || '/assets/diamond-ring.webp'" [alt]="item.name" class="thumb"></td>
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
                <td>
                  <span *ngFor="let tag of item.tags" class="tag">{{ tag }}</span>
                </td>
                <td>{{ item.stars }}</td>
                <td>{{ item.favorite ? '❤️' : '' }}</td>
                <td>
                  <button class="edit-btn" (click)="editItem(item)">Edit</button>
                  <button class="delete-btn" (click)="confirmDelete(item.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Orders Tab -->
      <div class="tab-content" *ngIf="activeTab === 'orders'">
        <div class="section-header">
          <h2>Manage Orders</h2>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td>{{ order.id }}</td>
                <td>User #{{ order.userId }}</td>
                <td>{{ order.total }}</td>
                <td>
                  <span class="status" [class]="order.status">{{ order.status }}</span>
                </td>
                <td>{{ order.items.length }} items</td>
                <td>{{ order.orderDate }}</td>
                <td>
                  <select [(ngModel)]="order.status">
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .admin-header h1 {
      margin: 0;
      color: #667eea;
    }
    .back-btn {
      background: white;
      color: #667eea;
      padding: 10px 20px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }
    .tab-btn {
      padding: 12px 24px;
      border: none;
      background: white;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    .tab-btn.active {
      background: #667eea;
      color: white;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .add-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
    }
    .form-container {
      background: white;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .form-container form {
      display: grid;
      gap: 15px;
    }
    .form-container input, .form-container textarea {
      padding: 12px;
      border: 2px solid #e1e1e1;
      border-radius: 8px;
      font-size: 16px;
    }
    .form-container label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .save-btn, .cancel-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    .save-btn {
      background: #667eea;
      color: white;
    }
    .cancel-btn {
      background: #6c757d;
      color: white;
    }
    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }
    .thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
    }
    .tag {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      margin: 2px;
    }
    .edit-btn, .delete-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
      font-size: 14px;
    }
    .edit-btn {
      background: #007bff;
      color: white;
    }
    .delete-btn {
      background: #dc3545;
      color: white;
    }
    .status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .status.pending { background: #fff3cd; color: #856404; }
    .status.shipped { background: #d1ecf1; color: #0c5460; }
    .status.delivered { background: #d4edda; color: #155724; }
    .status.cancelled { background: #f8d7da; color: #721c24; }
    @media (max-width: 768px) {
      .admin-header, .section-header, .tabs { flex-direction: column; gap: 15px; }
      .table-container { overflow-x: auto; }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab = 'products';
  jewelleryList: Jewellery[] = [];
  orders: Order[] = [];
  showForm = false;
  editingId: string | null = null;
  formData: Partial<Jewellery> = {};

  constructor(
    private jewelleryService: JewelleryService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  loadData() {
    this.jewelleryService.getAll().subscribe({
      next: (list: Jewellery[]) => this.jewelleryList = list,
      error: (err: any) => console.error('Error loading jewellery:', err)
    });
    this.orderService.getAllOrders().subscribe({
      next: (ords: Order[]) => this.orders = ords,
      error: (err: any) => console.error('Error loading orders:', err)
    });
  }

  editItem(item: Jewellery) {
    this.editingId = item.id;
    this.formData = { ...item };
    this.showForm = true;
  }

  cancelEdit() {
    this.editingId = null;
    this.formData = {};
    this.showForm = false;
  }

  onSubmit() {
    if (!this.formData.name || !this.formData.price) return;

    const submitData: Omit<Jewellery, 'id'> = {
      name: this.formData.name!,
      price: this.formData.price!,
tags: Array.isArray(this.formData.tags) ? this.formData.tags : (this.formData.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      favorite: !!this.formData.favorite,
      stars: this.formData.stars || 0,
      imageUrl: this.formData.imageUrl || '',
origins: Array.isArray(this.formData.origins) ? this.formData.origins : (this.formData.origins || '').split(',').map((o: string) => o.trim()).filter(Boolean)
    };

    if (this.editingId) {
      this.jewelleryService.updateJewellery(this.editingId, submitData).subscribe(() => {
        this.loadData();
        this.cancelEdit();
      });
    } else {
      this.jewelleryService.createJewellery(submitData).subscribe(() => {
        this.loadData();
        this.showForm = false;
        this.formData = {};
      });
    }
  }

  confirmDelete(id: string) {
    if (confirm('Delete this product?')) {
      this.jewelleryService.deleteJewellery(id).subscribe(() => {
        this.loadData();
      });
    }
  }
}

