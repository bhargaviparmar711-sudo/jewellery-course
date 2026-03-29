import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number; // ms
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 5000): void {
    const id = 'toast-' + Date.now();
    const toast: ToastMessage = { id, type, message, duration };
    
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, toast]);

    // Auto remove after duration
    setTimeout(() => this.remove(id), duration);
  }

  showSuccess(message: string, duration = 5000): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration = 7000): void {
    this.show(message, 'error', duration);
  }

  remove(id: string): void {
    const current = this.messagesSubject.value;
    this.messagesSubject.next(current.filter(m => m.id !== id));
  }

  clear(): void {
    this.messagesSubject.next([]);
  }
}

