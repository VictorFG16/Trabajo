import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { InventoryTable } from './inventory-table/inventory-table';
import { Navbar } from './navbar/navbar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  imports: [ InventoryTable, Navbar, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls:['./dashboard.css']
})
export class Dashboard {

}
