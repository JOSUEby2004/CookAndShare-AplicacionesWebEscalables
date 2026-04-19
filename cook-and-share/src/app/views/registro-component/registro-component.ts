import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-component.html',
  styleUrls: ['./registro-component.css'] // Usará el mismo CSS que el login
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signal para mostrar error si las contraseñas no son iguales
  passwordsNoCoinciden = signal(false);

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmar: ['', Validators.required]
  });

  registrar() {
    if (this.registroForm.valid) {

      // Llamamos al servicio
      this.authService.registrar(this.registroForm.value).subscribe({
        next: (respuesta) => {
          alert('¡Bienvenido a Cook&Share! 🎉 Tu cuenta ha sido creada.');
          // Lo mandamos al login para que inicie sesión
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al registrar', err);
          alert(err.error.mensaje || 'Hubo un problema con el registro.');
        }
      });

    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}