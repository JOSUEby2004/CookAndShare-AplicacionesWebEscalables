import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, RouterLink, TitleCasePipe],
  templateUrl: './catalogo-component.html',
  styleUrls: ['./catalogo-component.css']
})
export class CatalogoComponent implements OnInit{
  private recipeService = inject(RecipeService);

  // Inicializamos el signal vacío
  recetas = signal<any[]>([]);

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

  ngOnInit() {
    // Al iniciar el componente, traemos los datos reales
    this.recipeService.getRecetas().subscribe({
      next: (datos) => {
        console.log('Recetas traídas de MongoDB:', datos);
        this.recetas.set(datos); // Actualizamos el signal con la info real
      },
      error: (err) => {
        console.error('Error al conectar con el backend:', err);
      }
    });
  }
}