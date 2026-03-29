import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { cart } from '../../../../shared/models/cart';
import { cartItem } from '../../../../shared/models/cartItem';
import { CartService } from '../../../services/cart';
import { OrderService, CreateOrderRequest } from '../../../services/order';
import { AuthService } from '../../../services/auth';
import { ToastService } from "../../../services/toast";
import { Address } from "../../../../shared/models/order";

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CartPage {
  public toastService = inject(ToastService);
  public get toast() {
    return this.toastService;
  }
  cart!: cart;
  isLoggedIn = false;
  currentUser: any = null;

  // Checkout form
  checkoutForm = {
    address: {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip: ''
    } as Address
  };

  isLoading = false;
  showCheckoutForm = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartService.getCartObservable().subscribe((data: cart) => {
      this.cart = data;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  toggleCheckoutForm(): void {
    this.showCheckoutForm = !this.showCheckoutForm;
  }

  checkout(): void {
    if (!this.cart?.items?.length || !this.isLoggedIn) {
      this.toastService.showError('Please login and add items to cart first!');
      if (!this.isLoggedIn) {
        this.router.navigate(['/login']);
      }
      return;
    }

    // Validate form
    if (!this.checkoutForm.address.name || !this.checkoutForm.address.phone) {
      this.toastService.showError('Please fill name and phone number');
      return;
    }

    this.isLoading = true;

    const orderRequest: CreateOrderRequest = {
      items: this.cart.items,
      total: this.cart.totalprice,
      userId: this.currentUser!.id,
      address: this.checkoutForm.address
    };

    this.orderService.placeOrder(orderRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.showSuccess('Order placed successfully! Redirecting...');
        this.cartService.clearCart();
        this.router.navigate(['/thank-you', response.order.id], { state: { order: response.order } });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Checkout failed:', err);
        this.toastService.showError('Checkout failed. Please try again.');
      }
    });
  }

  removeFromCart(cartItem: cartItem): void {
    this.cartService.removeFromCart(cartItem.jewellery.id);
  }

  changeQuantity(cartItem: cartItem, quantityInString: string): void {
    const quantity = parseInt(quantityInString, 10);

    if (isNaN(quantity) || quantity <= 0) return;

    this.cartService.changeQuantity(cartItem.jewellery.id, quantity);
  }

  trackByItem(_index: number, item: cartItem): string {
    return item.jewellery.id;
  }
}
