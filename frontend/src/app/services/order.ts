import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/order';

export interface CreateOrderRequest {
  items: Order['items'];
  total: number;
  userId: number;
  address: Order['address'];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:5000/api';  // Backend port

  constructor(private http: HttpClient) {}

  placeOrder(orderRequest: CreateOrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, orderRequest);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${userId}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${id}`, { status });
  }
}


