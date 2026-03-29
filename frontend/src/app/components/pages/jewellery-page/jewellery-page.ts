import { Component, OnInit, inject } from '@angular/core';
import { Jewellery } from '../../../../shared/models/jewellery';
import { cart } from '../../../../shared/models/cart';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JewelleryService } from '../../../services/jewellery';
import { CartService } from '../../../services/cart';
import { ToastService } from '../../../services/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jewellery-page',
  standalone: true,
  templateUrl: './jewellery-page.html',
  styleUrls: ['./jewellery-page.css'],
  imports: [RouterLink,CommonModule]
})
export class JewelleryPage implements OnInit {

  jewellery!: Jewellery;
  isLoading = false;
  itemInCartQuantity = 0;

  private route = inject(ActivatedRoute);
  private jewelleryService = inject(JewelleryService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  constructor() {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.jewelleryService.getJewelleryById(params['id'] as string).subscribe(data => {
          this.jewellery = data;
          // Track cart item for this jewellery
          this.cartService.getCartObservable().subscribe(cart => {
            const item = cart.items.find(i => i.jewellery.id === this.jewellery.id);
            this.itemInCartQuantity = item ? item.quantity : 0;
          });
        });
      }
    });
  }

  addToCart() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    this.cartService.addToCart(this.jewellery);
    this.toastService.showSuccess(`${this.jewellery.name} added to cart!`, 3000);
    
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}