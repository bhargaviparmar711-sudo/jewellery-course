import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home';
import { JewelleryPage } from './components/pages/jewellery-page/jewellery-page';
import { CartPage } from './components/pages/cart-page/cart-page';
import { LoginComponent } from './components/pages/login-page/login-page';
import { RegisterComponent } from './components/pages/register/register';
import { DashboardComponent } from './components/pages/dashboard/dashboard';
import { ThankYouComponent } from './components/pages/thank-you/thank-you';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: HomeComponent },
  { path: 'tag/:tag', component: HomeComponent },
  { path: 'jewellery/:id', component: JewelleryPage },
  { path: 'cart-page', component: CartPage },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
{ path: 'orders', component: DashboardComponent },
  { path: 'thank-you/:orderId', component: ThankYouComponent },
  { path: 'admin', canActivate: [adminGuard], loadChildren: () => import('./components/pages/admin/admin.routes').then(m => m.adminRoutes) },
  { path: '**', redirectTo: '' }
];


