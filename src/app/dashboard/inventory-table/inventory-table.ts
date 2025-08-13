import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-table',
  imports: [CommonModule],
  templateUrl: './inventory-table.html',
  styleUrls: ['./inventory-table.css']
})
export class InventoryTable {
agregar() {
throw new Error('Method not implemented.');
}
  inventory = [
    {
      producto: 'Pantalon',
      fechaAsignada: '31/07/2025',
      fechaEntrada: '20/06/2024',
      referencia: '592632',
      marca: 'HUMAN',
      op: '2697565',
      camp: '7',
      tipo: 'MX',
      talla: 'M',
      total: 10
    },
    // Puedes agregar más productos aquí
  ];

  paginaActual = 1;

  editar(item: any) {
    console.log('Editar', item);
    // Aquí puedes agregar la lógica para editar el producto
  }

  eliminar(item: any) {
    console.log('Eliminar', item);
    // Aquí puedes agregar la lógica para eliminar el producto
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
