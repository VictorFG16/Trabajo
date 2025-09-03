import { Component, OnInit } from '@angular/core';
import { Navbar } from "../dashboard/navbar/navbar";
import { Router } from '@angular/router';
import { ModuleService } from '../services/module.service';
import { CommonModule } from '@angular/common';
import { ProgressGaugeComponent } from './progress-gauge/progress-gauge.component';

@Component({
  selector: 'app-dashboard-de-modulos',
  imports: [Navbar, CommonModule, ProgressGaugeComponent],
  templateUrl: './dashboard-de-modulos.html',
  styleUrls: ['./dashboard-de-modulos.css'],
})
export class DashboardDeModulos implements OnInit {
  modules: any[] = [];
  loading = true;
  error: string | null = null;
  selectedModule: number | null = null; 

  constructor(
    private router: Router,
    private moduleService: ModuleService
  ) {}

  ngOnInit() {
    this.loadModules();
  }

  loadModules() {
    this.moduleService.getAllModules().subscribe({
      next: (data: any) => {
        this.modules = data.slice(0, 20); // Máximo 20 módulos
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los módulos';
        this.loading = false;
        
      }
    });
  }

  getModuleColor(remainingTime: number): string {
    if (remainingTime <= 0.49) {
      return 'red';
    } else if (remainingTime <= 0.99) {
      return '#FFDE21';
    } else if (remainingTime <= 7) {
      return 'green';
    } else {
      return 'red';
    }
  }

  onModuleSelect(module: any) {
    if (this.selectedModule === module) {
      this.selectedModule = null; // Deseleccionar si ya está seleccionado
    } else {
      this.selectedModule = module; // Seleccionar el módulo
    }
  }
  isAnyModuleSelected(): boolean {
    return this.selectedModule !== null;
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }

  agregarModulo(){
    this.router.navigate (['/agregar-modulo'])
  }
  
  editarModulo() { 
    if (this.selectedModule !== null) {
      const moduloSeleccionado = this.getModuleSeleccionado();
      this.router.navigate(['/edit-modulo', moduloSeleccionado.id]);
    }
  }

  getModuleSeleccionado(): any {
    if (this.selectedModule == null) {
      throw new Error('No hay ningún módulo seleccionado');
    }
    return this.selectedModule;
  }
}
