import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from './toast';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './toast.html',
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }
    .toast {
      padding: 16px 20px;
      border-radius: 8px;
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideInRight 0.3s ease-out;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 50px;
    }
    .toast-success { background: linear-gradient(135deg, #4caf50, #45a049); }
    .toast-error { background: linear-gradient(135deg, #f44336, #da190b); }
    .toast-info { background: linear-gradient(135deg, #2196f3, #0b7dda); }
    .toast-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.8;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toast-close:hover { opacity: 1; }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @media (max-width: 768px) {
      .toast-container { right: 10px; left: 10px; top: 10px; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
