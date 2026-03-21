import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro-component.html',
  styleUrls: ['./registro-component.css'] // Usará el mismo CSS que el login
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  
  // Signal para mostrar error si las contraseñas no son iguales
  passwordsNoCoinciden = signal(false);

  registroForm = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmar: ['', Validators.required]
  });

  registrar() {
    const { password, confirmar } = this.registroForm.value;
    
    // Validación manual de contraseñas idénticas
    if (password !== confirmar) {
      this.passwordsNoCoinciden.set(true);
      return;
    }
    
    this.passwordsNoCoinciden.set(false);

    if (this.registroForm.valid) {
      console.log('Nuevo usuario:', this.registroForm.value);
      alert('¡Simulación de Registro exitoso!');
      this.registroForm.reset();
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}