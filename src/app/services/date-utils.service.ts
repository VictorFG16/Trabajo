import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() { }

  /**
   * Formatea una fecha para mostrarla en la interfaz de usuario
   * Evita problemas de zona horaria usando UTC
   */
  formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // Usar UTC para evitar problemas de zona horaria
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '';
    }
  }

  /**
   * Formatea una fecha para enviarla al backend
   * Asegura que la fecha se mantenga en el formato correcto
   * Usa UTC para evitar problemas de zona horaria
   */
  formatDateForBackend(dateString: string): string {
    if (!dateString) return '';
    
    try {
      // Crear fecha usando UTC para evitar problemas de zona horaria
      const date = new Date(dateString + 'T00:00:00Z');
      
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // Extraer componentes UTC
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formateando fecha para backend:', error);
      return '';
    }
  }

  /**
   * Valida si una fecha es válida
   */
  isValidDate(dateString: string): boolean {
    if (!dateString) return false;
    
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene la fecha actual en formato para el backend
   */
  getCurrentDateForBackend(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}