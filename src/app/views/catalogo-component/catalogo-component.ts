import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, RouterLink, TitleCasePipe], // ¡Importante para el [(ngModel)] y las rutas!
  templateUrl: './catalogo-component.html',
  styleUrls: ['./catalogo-component.css']
})
export class CatalogoComponent {
  // Simulamos la base de datos (temporalmente)
  recetas = signal([
    { id: 1, titulo: 'Tacos al pastor', descripcion: 'Auténticos tacos mexicanos con piña.', categoria: 'platos-principales', imagen: '/img/tacos.jpeg' },
    { id: 2, titulo: 'Panqué de plátano', descripcion: 'Esponjoso y dulce.', categoria: 'postres', imagen: '/img/panque.jpeg' },
    { id: 3, titulo: 'Limonada de menta', descripcion: 'Refrescante bebida natural.', categoria: 'bebidas', imagen: '/img/limonada.jpeg' },
    { id: 4, titulo: 'Pasta', descripcion: 'Lo mejor de Italia, después de la pizza.', categoria: 'entradas', imagen: '/img/pasta.jpeg' }
  ]);

  // Señales para capturar lo que el usuario escribe o selecciona
  busqueda = signal('');
  categoriaSeleccionada = signal('');

  // Signal computado que se actualiza solo cada vez que cambian los filtros
  recetasFiltradas = computed(() => {
    const termino = this.busqueda().toLowerCase();
    const categoria = this.categoriaSeleccionada();

    return this.recetas().filter(receta => {
      const coincideTexto = receta.titulo.toLowerCase().includes(termino);
      const coincideCategoria = categoria ? receta.categoria === categoria : true;

      return coincideTexto && coincideCategoria;
    });
  });
}