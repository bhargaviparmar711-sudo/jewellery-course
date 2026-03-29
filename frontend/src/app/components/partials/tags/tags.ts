import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tag } from '../../../../shared/models/tag';
import { JewelleryService } from '../../../services/jewellery';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tags.html',
  styleUrl: './tags.css',
})
export class Tags implements OnInit {
  tags?: tag[];

  constructor(private jewelleryService: JewelleryService) {}

  ngOnInit(): void {
    this.jewelleryService.getAllTags().subscribe(data => {
      this.tags = data;
    });
  }
}