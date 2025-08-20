import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Navbar } from "../navbar/navbar";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, Navbar, CommonModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {
  product = {
    id: 0, // El ID se asignará automáticamente por el backend
    name: '',
    price: 0,
    quantity: 0,
    fechaAsignada: '',
    fechaEntrada: '',
    referencia: '',
    marca: '',
    op: '',
    camp: '',
    tipo: '',
    talla: '',
  };
  errorMessage = '';

  constructor(private productService: ProductService, private router: Router) {}

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    
    // Validar que todos los campos estén completos
    if (!this.product.name || !this.product.referencia || !this.product.fechaAsignada || 
        !this.product.fechaEntrada || !this.product.marca || !this.product.op || 
        !this.product.camp || !this.product.tipo || !this.product.talla || 
        !this.product.quantity) {
      this.errorMessage = 'Todos los campos son obligatorios. Por favor complete todos los campos.';
      return;
    }

    const productData = {
      name: this.product.name,
      price: 0, // Valor por defecto ya que no se usa en la tabla
      quantity: this.product.quantity,
      assignedDate: this.product.fechaAsignada,
      plantEntryDate: this.product.fechaEntrada,
      reference: this.product.referencia,
      brand: this.product.marca,
      op: this.product.op,
      campaign: this.product.camp,
      type: this.product.tipo,
      size: this.product.talla.toString()
    };

    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        console.log('Producto agregado:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al agregar producto:', error);
        this.errorMessage = 'Error al agregar el producto. Por favor intente nuevamente.';
      }
    });
  }

  volverAlInventario() {
    this.router.navigate(['/dashboard']);
  }

}
