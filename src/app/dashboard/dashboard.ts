import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { InventoryTable } from './inventory-table/inventory-table';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, InventoryTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
