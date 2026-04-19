import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-receta-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-receta-component.html',
  styleUrl: './crear-receta-component.css',
})
export class CrearRecetaComponent {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  // Definimos la estructura del formulario
  recipeForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['platos-principales', Validators.required],
    imagen: [''],
    ingredientes: this.fb.array([this.fb.control('', Validators.required)]),
    pasos: this.fb.array([
      this.fb.group({
        orden: [1],
        instruccion: ['', Validators.required]
      })
    ])
  });

  // Getters para facilitar el acceso a los arreglos en el HTML
  get ingredientes() { return this.recipeForm.get('ingredientes') as FormArray; }
  get pasos() { return this.recipeForm.get('pasos') as FormArray; }

  agregarIngrediente() { this.ingredientes.push(this.fb.control('', Validators.required)); }

  agregarPaso() {
    this.pasos.push(this.fb.group({
      orden: [this.pasos.length + 1],
      instruccion: ['', Validators.required]
    }));
  }

  enviarReceta() {
    if (this.recipeForm.valid) {
      this.recipeService.crearReceta(this.recipeForm.value).subscribe({
        next: () => {
          alert('¡Receta publicada con éxito! 🌮\n ¡Gracias por tu contribución!');
          this.router.navigate(['/catalogo']);
        },
        error: (err) => alert('Error al publicar: ' + err.error.mensaje)
      });
    }
  }

  eliminarIngrediente(index: number) {
    // Evitamos que el usuario borre todos y se quede sin inputs
    if (this.ingredientes.length > 1) {
      this.ingredientes.removeAt(index);
    }
  }

  eliminarPaso(index: number) {
    if (this.pasos.length > 1) {
      this.pasos.removeAt(index);
      // Recalculamos el número de "orden" de los pasos restantes
      this.pasos.controls.forEach((control, i) => {
        control.get('orden')?.setValue(i + 1);
      });
    }
  }
}
