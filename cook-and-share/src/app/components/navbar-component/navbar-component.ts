import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css']
})
export class NavbarComponent {
  private authService = inject(AuthService);

  // Signal para controlar si el menú hamburguesa está abierto o cerrado
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(val => !val);
  }

  // "Getter" para evaluar si el usuario es Admin
  get isAdmin(): boolean {
    const usuario = this.authService.obtenerUsuario();
    // Retorna true solo si el usuario existe y su rol es 'admin'
    return usuario !== null && usuario.rol === 'admin';
  }
}