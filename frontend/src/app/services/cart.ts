import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { cart } from '../../shared/models/cart';
import { Jewellery } from '../../shared/models/jewellery';
import { cartItem } from '../../shared/models/cartItem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<cart> = new BehaviorSubject(this.cart);

  constructor() {}

  // ✅ Add to Cart
  addToCart(jewellery: Jewellery): void {
    let cartItemExist = this.cart.items.find(item => item.jewellery.id === jewellery.id);

    if (cartItemExist) {
      cartItemExist.quantity++;
    } else {
      this.cart.items.push(new cartItem(jewellery));
    }

    this.setCartToLocalStorage();
  }

  // ✅ Remove Item
  removeFromCart(jewelleryId: string): void {
    this.cart.items = this.cart.items.filter(item => item.jewellery.id !== jewelleryId);
    this.setCartToLocalStorage();
  }

  // ✅ Change Quantity
  changeQuantity(jewelleryId: string, quantity: number): void {
    let item = this.cart.items.find(i => i.jewellery.id === jewelleryId);
    if (!item) return;

    item.quantity = quantity;
    this.setCartToLocalStorage();
  }

  // ✅ Clear Cart
  clearCart(): void {
    this.cart = new cart();
    this.setCartToLocalStorage();
  }

  // ✅ Get Cart Observable
  getCartObservable(): Observable<cart> {
    return this.cartSubject.asObservable();
  }

  // ✅ Save to LocalStorage (FIXED)
  private setCartToLocalStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    this.cart.totalprice = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );

    this.cart.totalcount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    localStorage.setItem('Cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  // ✅ Load from LocalStorage (FIXED)
  private getCartFromLocalStorage(): cart {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return new cart();
    }

    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new cart();
  }
}