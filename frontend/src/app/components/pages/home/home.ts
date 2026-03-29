import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Jewellery } from '../../../../shared/models/jewellery';
import { JewelleryService } from '../../../services/jewellery';
import { CartService } from '../../../services/cart';
import { SearchComponent } from '../../partials/search/search';
import { Tags } from "../../partials/tags/tags";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, Tags],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {

  jewellery: Jewellery[] = [];

  constructor(
    private jewelleryService: JewelleryService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['tag']) {
        this.jewelleryService.getJewelleryByTag(params['tag']).subscribe(data => {
          this.jewellery = data;
        });
      } else {
        this.activatedRoute.queryParams.subscribe(queryParams => {
          if (queryParams['searchTerm']) {
            this.jewelleryService.getAllBySearchTerm(queryParams['searchTerm']).subscribe(data => {
              this.jewellery = data;
            });
          } else {
            this.jewelleryService.getAll().subscribe(data => {
              this.jewellery = data;
            });
          }
        });
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  addToCart(item: Jewellery): void {
  this.cartService.addToCart(item);
   window.alert(item.name + ' added to cart');
  }

}