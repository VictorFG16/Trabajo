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

  constructor(private productService: ProductService, private router: Router, private dateUtils: DateUtilsService) {}

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
          fechaAsignada: this.dateUtils.formatDateForDisplay(product.assignedDate),
          fechaEntrada: this.dateUtils.formatDateForDisplay(product.plantEntryDate),
          referencia: product.reference,
          marca: product.brand,
          op: product.op,
          camp: product.campaign,
          tipo: product.type,
          talla: product.size,
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
  
   
  
  
    // Opciones disponibles para registros por página
    get opcionesRegistros() {
      return [10, 20, 30];
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

  // Verificar si hay alguna fila seleccionada
  isAnyRowSelected(): boolean {
    return this.selectedRow !== null;
  }
  // Método para cambiar el número de registros por página
  cambiarRegistrosPorPagina(nuevoValor: number) {
    this.itemsPorPagina = nuevoValor;
    this.paginaActual = 1; // Volver a la primera página
    this.selectedRow = null; // Limpiar selección
    // Guardar la nueva preferencia
    
    // Si la página actual es mayor que el total de páginas, ajustar
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas;
    }
  }
  // Método para editar la fila seleccionada
  editarFila() {
    if (this.selectedRow !== null) {
      const filaSeleccionada = this.productosPaginados[this.selectedRow];
      this.router.navigate(['/edit-product', filaSeleccionada.id]);
    }
  }

  // Método para eliminar la fila seleccionada
  eliminarFila() {
    if (this.selectedRow !== null) {
      const filaSeleccionada = this.productosPaginados[this.selectedRow];
      console.log('Eliminando fila:', this.selectedRow, 'Datos:', filaSeleccionada);
      // Aquí puedes implementar la lógica para eliminar la fila
      // Por ejemplo, mostrar un modal de confirmación
    }
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
    this.paginaActual++;
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
