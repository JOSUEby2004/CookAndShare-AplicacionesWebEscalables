import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../services/recipe-service';
import { CommentService } from '../../services/comment-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TitleCasePipe], // Importamos RouterLink para el botón de "volver"
  templateUrl: './detalle-component.html',
  styleUrls: ['./detalle-component.css']
})
export class DetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private commentService = inject(CommentService);

  // Iniciamos con un signal vacío
  receta = signal<any>(null);
  cargando = signal(true);
  error = signal(false);
  comentarios = signal<any[]>([]);
  nuevoComentarioTexto = signal(''); // Para el input del usuario

  ngOnInit() {
    // 1. Obtenemos el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // 2. Buscamos la receta real en MongoDB
      this.recipeService.getRecetaById(id).subscribe({
        next: (datos) => {
          this.receta.set(datos);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al cargar la receta', err);
          this.error.set(true);
          this.cargando.set(false);
        }
      });
      this.cargarComentarios(id);
    }
  }

  cargarComentarios(id: string) {
    this.commentService.getComentarios(id).subscribe({
      next: (datos) => this.comentarios.set(datos)
    });
  }

  enviarComentario() {
    const id = this.receta()._id;
    const texto = this.nuevoComentarioTexto();

    if (texto.trim()) {
      this.commentService.postComentario(id, texto).subscribe({
        next: () => {
          this.nuevoComentarioTexto.set(''); // Limpiar caja
          this.cargarComentarios(id); // Recargar lista para ver el nuestro
        },
        error: () => alert('Debes iniciar sesión para comentar')
      });
    }
  }
}