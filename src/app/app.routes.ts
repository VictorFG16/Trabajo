import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { AddProduct } from './dashboard/inventory-table/add-product/add-product';
import { EditProduct } from './dashboard/inventory-table/edit-product/edit-product'; 
import { Home } from './home/home';
import { DashboardDeModulos } from './dashboard-de-modulos/dashboard-de-modulos';
import { EditModulo } from './dashboard-de-modulos/edit-modulo/edit-modulo';
import { Buscador } from './buscador/buscador';
import { AgregarModulo } from './dashboard-de-modulos/agregar-modulo/agregar-modulo';


export const routes: Routes = [
    { path: '', component: Login },
    { path: 'home', component: Home },
    { path: 'dashboard', component: Dashboard },
    { path: 'add-product', component: AddProduct }, 
    { path: 'edit-product/:id', component: EditProduct }, 
    { path: 'dashboard-de-modulos', component: DashboardDeModulos },
    { path: 'edit-modulo/:id', component: EditModulo },
    { path: 'agregar-modulo', component: AgregarModulo},
    { path: 'buscador', component: Buscador }

    
];
