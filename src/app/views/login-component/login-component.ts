import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], // Importamos los formularios reactivos
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  // Creamos el modelo del formulario con validaciones
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ingresar() {
    if (this.loginForm.valid) {
      console.log('Datos listos para enviar a Node.js:', this.loginForm.value);
      alert('¡Simulación de Login exitoso! Pronto conectaremos el backend.');
      this.loginForm.reset();
    } else {
      // Si el usuario da clic sin llenar, forzamos a que se muestren los errores
      this.loginForm.markAllAsTouched(); 
    }
  }
}