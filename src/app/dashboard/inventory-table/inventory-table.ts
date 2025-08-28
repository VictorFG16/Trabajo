import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DateUtilsService } from '../../services/date-utils.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-table',
  imports: [CommonModule, FormsModule],
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
  selectedRow: number | null = null;
  searchTerm = '';
  isSearching = false;
  showDeleteModal = false;
  productToDelete: any = null;
  errorMessage = '';

  constructor(private productService: ProductService, private router: Router, private dateUtils: DateUtilsService) {}

  

  ngOnInit() {
    this.loadProducts();
    
  }
  loadProducts() {
    this.loading = true;
    this.isSearching = false;
    this.searchTerm = '';
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.inventory = products.map((product: any) => ({
          id: product.id,
          
          fechaAsignada: this.dateUtils.formatDateForDisplay(product.assignedDate),
          fechaEntrada: this.dateUtils.formatDateForDisplay(product.plantEntryDate),
          referencia: product.reference,
          marca: product.brand,
          op: product.op,
          camp: product.campaign,
          tipo: product.type,
          talla: product.size,
          descripcion: product.description,
          price: product.price,
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

  searchProducts() {
    if (!this.searchTerm.trim()) {
      this.loadProducts();
      return;
    }

    
    this.isSearching = true;
    this.productService.searchProducts(this.searchTerm).subscribe({
      next: (products) => {
        this.inventory = products.map((product: any) => ({
          id: product.id,
          producto: product.productName,
          fechaAsignada: this.dateUtils.formatDateForDisplay(product.assignedDate),
          fechaEntrada: this.dateUtils.formatDateForDisplay(product.plantEntryDate),
          referencia: product.reference,
          marca: product.brand,
          op: product.op,
          camp: product.campaign,
          tipo: product.type,
          talla: product.size,
          descripcion: product.description,
          price: product.price,
          total: product.quantity
        }));
        this.totalRegistros = this.inventory.length;
        this.loading = false;
        this.paginaActual = 1; // Volver a la primera página después de buscar
      },
      error: (error) => {
        this.error = 'Error al buscar productos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadProducts();
  }

    // Métodos para paginación
    get productosPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      // Asegurar que no excedamos el total de registros
      return this.inventory.slice(inicio, Math.min(fin, this.totalRegistros));
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
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      return this.totalRegistros > 0 ? inicio + 1 : 0;
    }
  
    get mostrandoHasta() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = Math.min(inicio + this.itemsPorPagina, this.totalRegistros);
      return fin;
    }
  
   
  
  
    // Opciones disponibles para registros por página
    get opcionesRegistros() {
      return [10, 20, 30];
    }
 volverAlHome() {
    this.router.navigate(['/home']);}
    
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

  // Verificar si hay alguna fila seleccionada
  isAnyRowSelected(): boolean {
    return this.selectedRow !== null;
  }
  // Método para cambiar el número de registros por página
  cambiarRegistrosPorPagina(nuevoValor: number) {
    this.itemsPorPagina = nuevoValor;
    this.paginaActual = 1; // Siempre volver a la primera página al cambiar registros por página
    this.selectedRow = null; // Limpiar selección
  }
  // Método para editar la fila seleccionada
  editarFila() {
    if (this.selectedRow !== null) {
      const filaSeleccionada = this.getFilaSeleccionada();
      this.router.navigate(['/edit-product', filaSeleccionada.id]);
    }
  }

  eliminarFila() {
    if (this.selectedRow !== null) {
      const filaSeleccionada = this.productosPaginados[this.selectedRow];
      this.productToDelete = filaSeleccionada;
      this.showDeleteModal = true;
    }
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.showMessage('Producto eliminado exitosamente', 'success');
          this.loadProducts(); // Recargar la lista después de eliminar
          this.selectedRow = null; // Limpiar selección
          this.closeDeleteModal();
        },
        error: (error) => {
          this.showMessage('Error al eliminar el producto', 'error');
          console.error('Error:', error);
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  // Método para mostrar mensajes
  showMessage(message: string, type: string) {
    this.errorMessage = message;
    // Aquí puedes agregar lógica para mostrar el mensaje en el UI
  }

  // Método para obtener los datos de la fila seleccionada
  getFilaSeleccionada() {
    if (this.selectedRow !== null) {
      return this.productosPaginados[this.selectedRow];
    }
    return null;
  }
  anterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  siguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }

  irAPagina(numero: number) {
    this.paginaActual = numero;
  }
  // Método para seleccionar una fila completa
  selectRow(rowIndex: number, event: MouseEvent) {
    event.stopPropagation();
    
    if (this.selectedRow === rowIndex) {
      this.selectedRow = null; // Deseleccionar si ya está seleccionada
    } else {
      this.selectedRow = rowIndex; // Seleccionar la fila
    }
  }

  // Verificar si una fila está seleccionada
  isRowSelected(rowIndex: number): boolean {
    return this.selectedRow === rowIndex;
  }
}
