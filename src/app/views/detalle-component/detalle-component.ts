import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [RouterLink], // Importamos RouterLink para el botón de "volver"
  templateUrl: './detalle-component.html',
  styleUrls: ['./detalle-component.css']
})
export class DetalleComponent implements OnInit {
  // inject() es la forma moderna de traer servicios en Angular v14+
  private route = inject(ActivatedRoute);

  // Usamos un signal que puede guardar un objeto o ser nulo
  receta = signal<any>(null);

  ngOnInit() {
    // 1. Atrapamos el ID de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    const idUrl = idParam ? parseInt(idParam, 10) : 0;

    // 2. Simulamos la búsqueda en la base de datos
    this.cargarReceta(idUrl);
  }

  cargarReceta(id: number) {
    // Simulamos un "JOIN" entre recetas, usuarios, ingredientes y pasos
    const mockDB = [
      {
        id: 1,
        titulo: 'Tacos al pastor',
        autor: 'Chef Carlos',
        categoria: 'Platos principales',
        imagen: '/img/tacos.jpeg',
        ingredientes: ['500g carne de cerdo', 'Tortillas de maíz', '1/2 Piña', 'Cilantro y cebolla'],
        pasos: ['Marinar la carne por 2 horas', 'Asar la carne en un sartén o trompo', 'Servir en tortillas y agregar piña'],
        comentarios: [{ usuario: 'Admin Cook&Share', texto: '¡Se ven deliciosos Carlos!' }]
      },
      {
        id: 2,
        titulo: 'Panqué de plátano',
        autor: 'Chef Carlos',
        categoria: 'Postres',
        imagen: '/img/panque.jpeg',
        ingredientes: ['3 plátanos maduros', '2 tazas de harina', '2 huevos', '1/2 taza de azúcar'],
        pasos: ['Machacar los plátanos', 'Mezclar con los ingredientes secos y líquidos', 'Hornear a 180°C por 45 mins'],
        comentarios: []
      }
    ];

    // Buscamos la receta. Si la encuentra, actualiza el signal.
    const encontrada = mockDB.find(r => r.id === id);
    if (encontrada) {
      this.receta.set(encontrada);
    }
  }
}