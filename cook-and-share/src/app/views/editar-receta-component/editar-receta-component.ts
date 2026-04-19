import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RecipeService } from '../../services/recipe-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-receta-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-receta-component.html',
  styleUrl: '../crear-receta-component/crear-receta-component.css',
})
export class EditarRecetaComponent {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recetaId = '';

  // Iniciamos el formulario vacío
  recipeForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    categoria: ['', Validators.required],
    imagen: [''],
    ingredientes: this.fb.array([]), // Lo iniciamos vacío porque lo llenaremos con los datos de Mongo
    pasos: this.fb.array([])
  });

  get ingredientes() { return this.recipeForm.get('ingredientes') as FormArray; }
  get pasos() { return this.recipeForm.get('pasos') as FormArray; }

  ngOnInit() {
    this.recetaId = this.route.snapshot.paramMap.get('id') || '';
    if (this.recetaId) {
      this.cargarDatos(this.recetaId);
    }
  }

  cargarDatos(id: string) {
    this.recipeService.getRecetaById(id).subscribe({
      next: (receta) => {
        // 1. Llenamos los campos simples (texto)
        this.recipeForm.patchValue({
          titulo: receta.titulo,
          descripcion: receta.descripcion,
          categoria: receta.categoria,
          imagen: receta.imagen
        });

        // 2. Llenamos los FormArrays dinámicamente
        receta.ingredientes.forEach((ing: string) => {
          this.ingredientes.push(this.fb.control(ing, Validators.required));
        });

        receta.pasos.forEach((paso: any) => {
          this.pasos.push(this.fb.group({
            orden: [paso.orden],
            instruccion: [paso.instruccion, Validators.required]
          }));
        });
      },
      error: () => alert('Error al cargar la receta')
    });
  }

  // Funciones de agregar/eliminar (Iguales a las de crear-receta)
  agregarIngrediente() { this.ingredientes.push(this.fb.control('', Validators.required)); }
  eliminarIngrediente(index: number) { this.ingredientes.removeAt(index); }

  agregarPaso() {
    this.pasos.push(this.fb.group({
      orden: [this.pasos.length + 1],
      instruccion: ['', Validators.required]
    }));
  }
  eliminarPaso(index: number) { this.pasos.removeAt(index); }

  // Enviar los datos actualizados
  guardarCambios() {
    if (this.recipeForm.valid) {
      this.recipeService.actualizarReceta(this.recetaId, this.recipeForm.value).subscribe({
        next: () => {
          alert('¡Receta actualizada! 📝');
          this.router.navigate(['/perfil']); // Lo regresamos a su perfil
        },
        error: (err) => alert('Error al guardar: ' + err.error.mensaje)
      });
    }
  }
}
