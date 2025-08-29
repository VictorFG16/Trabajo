import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService, Product } from '../services/product.service';
import { Navbar } from "../dashboard/navbar/navbar";

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css'
})
export class Buscador implements OnInit, OnDestroy {
  // Propiedades de búsqueda
  searchTerm: string = '';
  
  // Propiedades de resultados
  searchResults: Product[] = [];
  selectedProduct: Product | null = null;
  isLoading: boolean = false;
  hasSearched: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    // No se necesita configuración de debounce para búsqueda manual
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los datos iniciales
   */
  async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      const products = await this.productService.getProducts().toPromise();
      
      if (products && Array.isArray(products)) {
        // Agregar campo de estado si no existe
        this.searchResults = products.map(product => ({
          ...product,
         
        }));
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Determina el estado del producto basado en sus datos
   */
  

  /**
   * Busca productos por número de OP
   */
  async searchByOP(): Promise<void> {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      this.selectedProduct = null;
      this.hasSearched = false;
      return;
    }

    try {
      this.isLoading = true;
      this.hasSearched = true;

      // Obtener todos los productos
      const allProducts = await this.productService.getProducts().toPromise() || [];
      
      // Filtrar por término de búsqueda
      this.searchResults = allProducts
        .filter((product: Product) => this.matchesSearchTerm(product, this.searchTerm))
        .map((product: Product) => ({
          ...product,
          
        }));

      // Si hay resultados, seleccionar el primero automáticamente
      if (this.searchResults.length > 0) {
        this.selectProduct(this.searchResults[0]);
      } else {
        this.selectedProduct = null;
      }

    } catch (error) {
      console.error('Error en la búsqueda:', error);
      this.searchResults = [];
      this.selectedProduct = null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Verifica si un producto coincide con el término de búsqueda (solo por número de OP)
   */
  private matchesSearchTerm(product: Product, term: string): boolean {
    const searchTerm = term.toLowerCase().trim();
    // Solo buscar por número de OP
    return product.op?.toLowerCase().includes(searchTerm) || false;
  }

  /**
   * Selecciona un producto para mostrar sus detalles
   */
  selectProduct(product: Product): void {
    this.selectedProduct = product;
  }

  /**
   * Maneja el input de búsqueda con validación
   */
  onSearchInput(): void {
    // Solo filtrar números, sin búsqueda automática
    this.searchTerm = this.searchTerm.replace(/[^0-9]/g, '');
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchTerm = '';
    ;
  }

 
  trackByProduct(index: number, product: Product): number {
    return product.id;
  }
  volverAlHome() {
    this.router.navigate(['/home']);
  }
}
