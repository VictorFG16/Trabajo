import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Sidebar } from './sidebar/sidebar';
import { AddProduct } from './dashboard/add-product/add-product';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'dashboard', component: Dashboard },
    { path: 'sidebar', component: Sidebar},
    { path: 'add-product', component: AddProduct } 
];
