import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Sidebar } from './sidebar/sidebar';
import { AddProduct } from './dashboard/inventory-table/add-product/add-product';
import { EditProduct } from './dashboard/inventory-table/edit-product/edit-product'; 

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'dashboard', component: Dashboard },
    { path: 'sidebar', component: Sidebar},
    { path: 'add-product', component: AddProduct }, 
    { path: 'edit-product/:id', component: EditProduct }, 
];
