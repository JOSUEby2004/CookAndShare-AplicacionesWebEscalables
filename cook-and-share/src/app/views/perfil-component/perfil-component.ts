import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { RecipeService } from '../../services/recipe-service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-component',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './perfil-component.html',
  styleUrl: './perfil-component.css',
})
export class PerfilComponent {
  private authService = inject(AuthService);
  private recipeService = inject(RecipeService);

  usuario = signal<any>(null);
  misRecetas = signal<any[]>([]);

  // Variables para el modo edición
  editando = signal(false);
  editNombre = signal('');
  editFoto = signal('');

  ngOnInit() {
    // 1. Carga inicial rápida
    this.cargarUsuario();

    // 2. Traer datos frescos
    this.authService.getMiPerfil().subscribe({
      next: (user) => {
        this.usuario.set(user);
        this.editNombre.set(user.nombre);
        this.editFoto.set(user.foto_perfil || '');
        this.authService.guardarUsuario(user);
      },
      error: (err) => console.error('Error al actualizar perfil en segundo plano', err)
    });

    // 3. Traemos sus recetas
    this.recipeService.getMisRecetas().subscribe({
      next: (recetas) => this.misRecetas.set(recetas),
      error: (err) => console.error('Error al cargar mis recetas', err)
    });
  }

  cargarUsuario() {
    const user = this.authService.obtenerUsuario();
    this.usuario.set(user);
    if (user) {
      this.editNombre.set(user.nombre);
      // Pre-llenamos las cajas con la información actual
      this.editFoto.set(user.foto_perfil || user.foto || '');
    }
  }

  activarEdicion() {
    this.editando.set(true);
  }

  cancelarEdicion() {
    this.editando.set(false);
    this.cargarUsuario(); // Restauramos los valores originales
  }

  guardarPerfil() {
    const datosActualizados = {
      nombre: this.editNombre(),
      foto: this.editFoto()
    };

    this.authService.actualizarPerfil(datosActualizados).subscribe({
      next: (respuesta) => {
        // Guardamos el nuevo usuario en LocalStorage para que no se pierda al recargar
        this.authService.guardarUsuario(respuesta.usuario);
        this.usuario.set(respuesta.usuario);
        this.editando.set(false);
        alert('¡Perfil actualizado con éxito! ✨');
      },
      error: (err) => {
        console.error('Error', err);
        alert('Hubo un error al guardar tu perfil.');
      }
    });
  }

  borrarReceta(id: string) {
    // Pedimos confirmación al usuario
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta receta permanentemente?');

    if (confirmacion) {
      // Llamamos al backend
      this.recipeService.eliminarReceta(id).subscribe({
        next: (respuesta) => {
          // Si Node.js dice que todo salió bien, la quitamos de la vista (del Signal)
          // Filtramos el arreglo para dejar todas las recetas MENOS la que acabamos de borrar
          this.misRecetas.set(this.misRecetas().filter(receta => receta._id !== id));
          alert('Receta eliminada 🗑️');
        },
        error: (err) => {
          console.error('Error al borrar', err);
          alert('Hubo un problema al intentar borrar la receta.');
        }
      });
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login'; // Recarga la app y manda al login
  }
}
