import { Component } from '@angular/core';
import { Navbar } from '../dashboard/navbar/navbar'; // Esta es la ruta correcta
import { CommonModule } from '@angular/common'; // Agregamos CommonModule para poder usar la navbar

@Component({
  selector: 'app-home',
  imports: [Navbar, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // ...
}