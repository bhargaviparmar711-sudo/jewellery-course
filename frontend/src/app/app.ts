import { HeaderComponent } from './component/header/header';
import { FooterComponent } from './component/footer/footer';
import { RouterModule } from "@angular/router";
import { LoginComponent } from './components/pages/login-page/login-page';
import { ToastComponent } from './services/toast.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
imports: [HeaderComponent, FooterComponent, RouterModule, ToastComponent],
  templateUrl: './app.html'
})
export class AppComponent {}