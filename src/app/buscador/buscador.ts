import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, firstValueFrom } from 'rxjs';
import { ProductService, Product } from '../services/product.service';
import { Navbar } from "../dashboard/navbar/navbar";
import { generateProductPdf } from './pdf-export-helper';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css'
})
export class Buscador implements OnInit, OnDestroy {
  searchTerm: string = '';
  searchResults: Product[] = [];
  selectedProduct: any = null;
  isLoading: boolean = false;
  hasSearched: boolean = false;

  sizeSummary: { size: string; quantity: number }[] = [];
  totalQuantity: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Normaliza un producto para que nunca tenga valores null/undefined */
  private normalizeProduct(product: any): Product {
    return {
      ...product,
      id: product.id,
      reference: product.reference ?? 'N/A',
      brand: product.brand ?? 'N/A',
      op: product.op ?? 'N/A',
      campaign: product.campaign ?? 'N/A',
      type: product.type ?? 'N/A',
      description: product.description ?? 'Sin descripción',
      price: product.price ?? 0,
      quantity: product.quantity ?? 0,
      cycleCalculated: product.cycleCalculated ?? 0,
      quantityMade: product.quantityMade ?? 0,
      missing: product.missing ?? 0,
      deliveryPercentage: product.deliveryPercentage ?? 0,
      sam: product.sam ?? 0,
      samTotal: product.samTotal ?? 0,
      loadDays: product.loadDays ?? 0,
      stoppageReason: product.stoppageReason ?? 'N/A',
      actualDeliveryDate: product.actualDeliveryDate ?? null,
      status: product.status ?? 'N/A',
      numPersons: product.module?.numPersons ?? 0,
      module: {
        name: product.module?.name ?? 'N/A',
        description: product.module?.description ?? 'N/A',
        numPersons: product.module?.numPersons ?? 0
      },
      sizeQuantities: product.sizeQuantities ?? {}
    };
  }

  async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      const products = await firstValueFrom(this.productService.getProducts());
      if (products && Array.isArray(products)) {
        this.searchResults = products.slice(-5).map((p) => this.normalizeProduct(p));
        // No seleccionar automáticamente ningún producto para que el panel derecho vacío se muestre
        this.selectedProduct = null;
        this.sizeSummary = [];
        this.totalQuantity = 0;
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async searchByOP(): Promise<void> {
    if (!this.searchTerm.trim()) {
      this.clearSearch();
      return;
    }
    try {
      this.isLoading = true;
      this.hasSearched = true;

      console.log('Buscando productos...');
      const allProducts = await firstValueFrom(this.productService.getProducts()) || [];
      console.log('Productos obtenidos del backend:', allProducts);

      this.searchResults = allProducts
        .filter((product: Product) => this.matchesSearchTerm(product, this.searchTerm))
        .map((p: Product) => this.normalizeProduct(p))
        .slice(-5);
      console.log('Resultados filtrados:', this.searchResults);

      if (this.searchResults.length > 0) {
        const productId = this.searchResults[0].id;
        console.log('Obteniendo detalles del producto ID:', productId);
        const productDetails = await firstValueFrom(this.productService.getProductById(productId));
        console.log('Detalles del producto obtenidos:', productDetails);
        const normalized = this.normalizeProduct(productDetails);
        console.log('Producto normalizado:', normalized);
        this.selectProduct(normalized);
      } else {
        console.log('No se encontraron productos para el término de búsqueda');
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

  private matchesSearchTerm(product: Product, term: string): boolean {
    const searchTerm = term.toLowerCase().trim();
    return product.op?.toLowerCase().includes(searchTerm) ?? false;
  }

  selectProduct(product: Product): void {
    console.log('Producto seleccionado:', product);
    this.selectedProduct = product;
    this.calculateSizeSummary();
  }

  private calculateSizeSummary(): void {
    if (!this.selectedProduct || !this.selectedProduct.sizeQuantities) {
      this.sizeSummary = [];
      this.totalQuantity = 0;
      return;
    }
    const sizeQuantities: Record<string, number> = this.selectedProduct.sizeQuantities;
    this.sizeSummary = Object.entries(sizeQuantities)
      .map(([size, quantity]) => ({ size, quantity }))
      .sort((a, b) => {
        const aNum = parseFloat(a.size);
        const bNum = parseFloat(b.size);
        return isNaN(aNum) || isNaN(bNum)
          ? a.size.localeCompare(b.size)
          : aNum - bNum;
      });
    this.totalQuantity = this.sizeSummary.reduce((total, item) => total + item.quantity, 0);
  }

  onSearchInput(): void {
    this.searchTerm = this.searchTerm.replace(/[^0-9]/g, '');
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.selectedProduct = null;
    this.sizeSummary = [];
    this.totalQuantity = 0;
    this.hasSearched = false;
  }

  trackByProduct(index: number, product: Product): string {
    return product.op;
  }

  volverAlHome(): void {
    this.router.navigate(['/home']);
  }

  exportToPdf(): void {
    if (this.selectedProduct) {
      generateProductPdf(this.selectedProduct, this.sizeSummary, this.totalQuantity);
    }
  }
}
