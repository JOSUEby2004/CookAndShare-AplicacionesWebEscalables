import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder); //Inyección de servicios
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ingresar() {
    if (this.loginForm.valid) {

      // Llamamos al servicio y nos suscribimos a la respuesta de Node.js
      this.authService.login(this.loginForm.value).subscribe({

        // Si Node.js responde con un 200 OK (Credenciales correctas)
        next: (respuesta) => {
          console.log('¡Login exitoso!', respuesta);
          this.authService.guardarToken(respuesta.token); // Guardamos su "gafete" y que vea las recetas
          this.authService.guardarUsuario(respuesta.usuario); // Guardamos los datos del usuario  
          this.router.navigate(['/catalogo']);
        },

        // Si Node.js responde con un error 400 (Credenciales inválidas)
        error: (err) => {
          console.error('Error al iniciar sesión', err);
          alert(err.error.mensaje || 'Error al iniciar sesión');
        }

      });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}