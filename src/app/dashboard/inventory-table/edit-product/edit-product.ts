
import { Component, ViewChild, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DateUtilsService } from '../../../services/date-utils.service';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-edit-product',
  imports: [FormsModule, CommonModule, Navbar],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {
  product = {
    id: 0,
    description: '',
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
  loading = false;
  productId: number = 0;

  constructor(
    private productService: ProductService, 
    private router: Router,
    private route: ActivatedRoute,
    private dateUtils: DateUtilsService
  ) {}

  ngOnInit() {
    // Obtener el ID del producto de la URL
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      if (this.productId) {
        this.loadProduct(this.productId);
      }
    });
  }

  // Cargar el producto para editar
  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product: any) => {
        // Mapear los datos del producto al formato del formulario
        this.product = {
          id: product.id,
          description: product.description || '',
          price: product.price || 0,
          quantity: product.quantity || 0,
          fechaAsignada: this.dateUtils.formatDateForBackend(product.assignedDate),
          fechaEntrada: this.dateUtils.formatDateForBackend(product.plantEntryDate),
          referencia: product.reference || '',
          marca: product.brand || '',
          op: product.op || '',
          camp: product.campaign || '',
          tipo: product.type || '',
          talla: product.size || '',
        };
        this.loading = false;
      },
      error: (error:any) => {
        console.error('Error al cargar el producto:', error);
        this.errorMessage = 'Error al cargar el producto para editar.';
        this.loading = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    
    // Validar que todos los campos estén completos
    if (!this.product.referencia || !this.product.fechaAsignada || 
        !this.product.fechaEntrada || !this.product.marca || !this.product.op || 
        !this.product.camp || !this.product.tipo || !this.product.talla || 
        !this.product.quantity) {
      this.errorMessage = 'Todos los campos son obligatorios. Por favor complete todos los campos.';
      return;
    }

    // Validar que las fechas sean válidas
    if (!this.dateUtils.isValidDate(this.product.fechaAsignada) || 
        !this.dateUtils.isValidDate(this.product.fechaEntrada)) {
      this.errorMessage = 'Las fechas ingresadas no son válidas.';
      return;
    }


    const productData = {
      id: this.product.id,
      description: this.product.description,
      price: this.product.price,
      quantity: this.product.quantity,
      assignedDate: this.dateUtils.formatDateForBackend(this.product.fechaAsignada),
      plantEntryDate: this.dateUtils.formatDateForBackend(this.product.fechaEntrada),
      reference: this.product.referencia,
      brand: this.product.marca,
      op: this.product.op,
      campaign: this.product.camp,
      type: this.product.tipo,
      size: this.product.talla.toString()
    };

    this.loading = true;
    this.productService.updateProduct(this.product.id, productData).subscribe({
      next: (response) => {
        console.log('Producto actualizado:', response);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        this.errorMessage = 'Error al actualizar el producto. Por favor intente nuevamente.';
        this.loading = false;
      }
    });
  }

  volverAlInventario() {
    this.router.navigate(['/dashboard']);
  }
}


