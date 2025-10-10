import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { TeamService, Team } from '../services/team.service';
import { Navbar } from '../dashboard/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class Reportes implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  teams: Team[] = [];
  selectedTeamId: number | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  entriesPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  hasSearched: boolean = false;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private teamservice: TeamService, private router: Router
  ) {}

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamservice.getAllTeams().subscribe((teams: Team[]) => {
      this.teams = teams;
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      if (this.selectedTeamId === null && !(this.startDate && this.endDate)) {
        this.errorMessage = 'Debe seleccionar un módulo o ambas fechas (inicio y fin).';
        this.hasSearched = false;
        this.filteredProducts = [];
        this.paginatedProducts = [];
        return;
      } else if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
        this.errorMessage = 'La fecha de inicio no puede ser mayor que la fecha de fin.';
        this.hasSearched = false;
        this.filteredProducts = [];
        this.paginatedProducts = [];
        return;
      } else {
        this.errorMessage = '';
      }
      this.applyFilters();
      this.hasSearched = true;
    });
  }

  applyFilters() {
    this.filteredProducts = this.products;

    if (this.selectedTeamId !== null) {
      this.filteredProducts = this.filteredProducts.filter(
        p => p.team && p.team.id === this.selectedTeamId
      );
    }

    if (this.startDate) {
      const start = new Date(this.startDate);
      this.filteredProducts = this.filteredProducts.filter(
        p => new Date(p.assignedDate) >= start
      );
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      this.filteredProducts = this.filteredProducts.filter(
        p => new Date(p.assignedDate) <= end
      );
    }

    // Ordenar por fecha asignación descendente
    this.filteredProducts.sort(
      (a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
    );

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.entriesPerPage);
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    const endIndex = startIndex + this.entriesPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onEntriesChange(entries: number) {
    this.entriesPerPage = entries;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.entriesPerPage);
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  goToPage(page: number, event: Event) {
    event.preventDefault();
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  getTeamName(teamId: number) {
    const team = this.teams.find(m => m.id === teamId);
    return team ? team.name : 'N/A';
  }

  clearFilters() {
    this.selectedTeamId = null;
    this.startDate = null;
    this.endDate = null;
    this.entriesPerPage = 5;
    this.currentPage = 1;
    this.hasSearched = false;
    this.filteredProducts = [];
    this.paginatedProducts = [];
    this.totalPages = 1;
    this.errorMessage = '';
  }

  volverAlHome() {
    this.router.navigate(['/home']);
}
}