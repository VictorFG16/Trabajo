import { Component } from '@angular/core';
import { Navbar } from "../../dashboard/navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-modulo',
  imports: [Navbar, FormsModule, CommonModule],
  templateUrl: './agregar-modulo.html',
  styleUrl: './agregar-modulo.css'
})
export class AgregarModulo {

  constructor (private router: Router){}
    
  

volverAlModulo() {
this.router.navigate (['/dashboard-de-modulos'])
}
module: any;
loading: any;
onSubmit(_t14: any) {
throw new Error('Method not implemented.');
}
errorMessage: any;

}
