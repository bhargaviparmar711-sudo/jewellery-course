import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JewelleryService } from '../../services/jewellery';
import { Jewellery } from '../../../shared/models/jewellery';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})

export class HeaderComponent implements OnInit {

  jewellery: Jewellery[] = [];

  constructor(private jewelleryService: JewelleryService) {}

  ngOnInit(): void {
    this.jewelleryService.getAll().subscribe(data => {
      this.jewellery = data;
    });
  }

}