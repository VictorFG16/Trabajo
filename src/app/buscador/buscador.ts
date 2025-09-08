import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, firstValueFrom } from 'rxjs';
import { ProductService, Product } from '../services/product.service';
import { Navbar } from "../dashboard/navbar/navbar";

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './buscador.html',
  styleUrls: ['./buscador.css']
})
export class Buscador implements OnInit, OnDestroy {
  searchTerm: string = '';

  searchResults: Product[] = [];
  selectedProduct: Product | null = null;
  isLoading: boolean = false;
  hasSearched: boolean = false;

  sizeSummary: { size: string; quantity: number }[] = [];
  totalQuantity: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los últimos 5 productos
   */
  async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      const products = await firstValueFrom(this.productService.getProducts());

      if (products && Array.isArray(products)) {
        this.searchResults = products.slice(-5); // últimos 5
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Búsqueda manual por número de OP (últimos 5 resultados)
   */
  async searchByOP(): Promise<void> {
    if (!this.searchTerm.trim()) {
      this.clearSearch();
      return;
    }

    try {
      this.isLoading = true;
      this.hasSearched = true;

      const allProducts = await firstValueFrom(this.productService.getProducts()) || [];

      this.searchResults = allProducts
        .filter((product: Product) => this.matchesSearchTerm(product, this.searchTerm))
        .slice(-5); // últimos 5 coincidentes

      if (this.searchResults.length > 0) {
        this.selectProduct(this.searchResults[0]);
      } else {
        this.selectedProduct = null;
        this.sizeSummary = [];
        this.totalQuantity = 0;
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
   * Verifica si el producto coincide con el término buscado (solo por número de OP)
   */
  private matchesSearchTerm(product: Product, term: string): boolean {
    const searchTerm = term.toLowerCase().trim();
    return product.op?.toLowerCase().includes(searchTerm) ?? false;
  }

  /**
   * Selecciona un producto y calcula el resumen de tallas
   */
  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.calculateSizeSummary();
  }

  /**
   * Calcula resumen de tallas y cantidad total del producto seleccionado
   */
  private calculateSizeSummary(): void {
    if (!this.selectedProduct || !this.selectedProduct.sizeQuantities) {
      this.sizeSummary = [];
      this.totalQuantity = 0;
      return;
    }

    const sizeQuantities: Record<string, number> = this.selectedProduct.sizeQuantities;

    this.sizeSummary = Object.entries(sizeQuantities)
      .map(([size, quantity]) => ({
        size,
        quantity
      }))
      .sort((a, b) => {
        const aNum = parseFloat(a.size);
        const bNum = parseFloat(b.size);
        return isNaN(aNum) || isNaN(bNum)
          ? a.size.localeCompare(b.size)
          : aNum - bNum;
      });

    this.totalQuantity = this.sizeSummary.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Limpia caracteres no numéricos del input
   */
  onSearchInput(): void {
    this.searchTerm = this.searchTerm.replace(/[^0-9]/g, '');
  }

  /**
   * Limpia todos los resultados y el estado
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.selectedProduct = null;
    this.sizeSummary = [];
    this.totalQuantity = 0;
    this.hasSearched = false;
  }

  /**
   * Necesario para optimizar ngFor
   */
  trackByProduct(index: number, product: Product): number {
    return product.id;
  }

  /**
   * Navega al home
   */
  volverAlHome(): void {
    this.router.navigate(['/home']);
  }
}
