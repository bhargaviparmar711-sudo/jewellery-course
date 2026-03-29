import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.html',
  styleUrls: ['./title.css'],
})
export class Title {

  @Input()
  title!: string;

  @Input()
  margin: string = '1rem 0.1rem 0.2rem';

  @Input()
  fontsize: string = '1.7rem';
}