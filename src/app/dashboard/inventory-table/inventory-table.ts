import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';



@Component({
  selector: 'app-inventory-table',
  imports: [CommonModule,],
  templateUrl: './inventory-table.html',
  styleUrls: ['./inventory-table.css']
})
export class InventoryTable implements OnInit {
  inventory: any[] = [];
  loading = true;
  error = '';
  paginaActual = 1;
  showAddProductForm = false;
  itemsPorPagina = 10;
  totalRegistros = 0;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.inventory = products.map((product: any) => ({
          id: product.id,
          producto: product.productName,
          fechaAsignada: new Date(product.assignedDate).toLocaleDateString('es-ES'),
          fechaEntrada: new Date(product.plantEntryDate).toLocaleDateString('es-ES'),
          referencia: product.reference,
          marca: product.brand,
          op: product.op,
          camp: product.campaign,
          tipo: product.type,
          talla: product.size,
          total: product.quantity
        }));
        this.totalRegistros = this.inventory.length;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  // Métodos para paginación
  get productosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.inventory.slice(inicio, fin);
  }

  get totalPaginas() {
    return Math.ceil(this.totalRegistros / this.itemsPorPagina);
  }

  get paginas() {
    const paginas = [];
    for (let i = 1; i <= this.totalPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  get mostrandoDesde() {
    return (this.paginaActual - 1) * this.itemsPorPagina + 1;
  }

  get mostrandoHasta() {
    const fin = this.paginaActual * this.itemsPorPagina;
    return fin > this.totalRegistros ? this.totalRegistros : fin;
  }

  agregar() {
    this.router.navigate(['/add-product']);
  }

  onProductAdded() {
    this.showAddProductForm = false;
    this.loadProducts(); // Recargar la lista después de agregar
  }

  onCancel() {
    this.showAddProductForm = false;
  }

  editar(item: any) {
    console.log('Editar', item);
  }

  OnEliminar(item: any) {
    console.log('Eliminar', item);
  }

  anterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  siguiente() {
    this.paginaActual++;
  }

  irAPagina(numero: number) {
    this.paginaActual = numero;
  }
}
