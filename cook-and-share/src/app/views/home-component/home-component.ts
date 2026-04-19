import { Component, inject, OnInit, signal } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // Importamos RouterLink para el botón del Hero
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent {
  private recipeService = inject(RecipeService);

  // Signal para guardar solo las 6 destacadas
  recetasDestacadas = signal<any[]>([]);

  ngOnInit() {
    this.recipeService.getRecetas().subscribe({
      next: (datos) => {
        // Tomamos solo las primeras 6 del arreglo que nos da Node.js
        this.recetasDestacadas.set(datos.slice(0, 6));
      },
      error: (err) => console.error('Error al cargar destacadas', err)
    });
  }
}