import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../shared/models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser = typeof window !== 'undefined';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    if (this.isBrowser) {
      const storedUser = this.getUserFromStorage();
      this.currentUserSubject.next(storedUser);
    }
  }

  login(email: string, password: string, rememberMe: boolean): { success: boolean; user?: User; message?: string } {
    const MOCK_USERS: User[] = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@noorjewellers.com',
        role: 'admin'
      },
      {
        id: 2,
        name: 'Regular User',
        email: 'bhargavi@noorjewellers.com',
        role: 'bhargavi'
      }
    ];

    const user = MOCK_USERS.find(u => u.email === email);
    
    if (user && (password === 'admin123' || password === 'bhargavi123')) {
      this.setUserToStorage(user, rememberMe);
      this.currentUserSubject.next(user);
      return { success: true, user };
    }
    
    return { success: false, message: 'Invalid email or password' };
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  private setUserToStorage(user: User, rememberMe: boolean): void {
    if (!this.isBrowser) return;
    const userString = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem('user', userString);
    } else {
      sessionStorage.setItem('user', userString);
    }
  }

  private getUserFromStorage(): User | null {
    if (!this.isBrowser) return null;
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        return JSON.parse(localUser);
      } catch {
        return null;
      }
    }
    
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      try {
        return JSON.parse(sessionUser);
      } catch {
        return null;
      }
    }
    
    return null;
  }
}
