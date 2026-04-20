import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { RecipeService } from '../../services/recipe-service';
import { CommentService } from '../../services/comment-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-component',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {
  private authService = inject(AuthService);
  private recipeService = inject(RecipeService);
  private commentService = inject(CommentService);

  usuarios = signal<any[]>([]);
  recetas = signal<any[]>([]);
  comentarios = signal<any[]>([]);

  // Pestañas del panel
  vistaActual = signal<'usuarios' | 'recetas' | 'comentarios'>('usuarios');

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Traer usuarios
    this.authService.getTodosLosUsuarios().subscribe({
      next: (datos) => this.usuarios.set(datos),
      error: (err) => console.error('Error cargando usuarios', err)
    });

    // 2. Traer TODAS las recetas (Admin)
    this.recipeService.getTodasLasRecetasAdmin().subscribe({
      next: (datos) => this.recetas.set(datos),
      error: (err) => console.error('Error cargando recetas para admin', err)
    });

    // 3. Traer TODOS los comentarios (Admin)
    this.commentService.getTodosLosComentariosAdmin().subscribe({
      next: (datos) => this.comentarios.set(datos),
      error: (err) => console.error('Error cargando comentarios para admin', err)
    });
  }

  cambiarVista(vista: 'usuarios' | 'recetas' | 'comentarios') {
    this.vistaActual.set(vista);
  }

  cambiarEstadoReceta(id: string, nuevoEstado: string) {
    this.recipeService.cambiarEstado(id, nuevoEstado).subscribe({
      next: () => {
        // Actualizamos la receta en la tabla sin tener que recargar la página
        this.recetas.set(this.recetas().map(r =>
          r._id === id ? { ...r, estado: nuevoEstado } : r
        ));
      },
      error: (err) => alert('Error al cambiar el estado')
    });
  }

  borrarUsuario(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar a este usuario permanentemente?')) {
      this.authService.eliminarUsuarioAdmin(id).subscribe({
        next: () => {
          // Quitamos al usuario de la tabla
          this.usuarios.set(this.usuarios().filter(u => u._id !== id));
        },
        error: (err) => alert(err.error.mensaje || 'Error al eliminar usuario')
      });
    }
  }

  borrarComentario(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      this.commentService.eliminarComentarioAdmin(id).subscribe({
        next: () => {
          // Quitamos el comentario de la tabla actualizando el Signal
          this.comentarios.set(this.comentarios().filter(c => c._id !== id));
        },
        error: (err) => alert('Error al eliminar el comentario')
      });
    }
  }
}
