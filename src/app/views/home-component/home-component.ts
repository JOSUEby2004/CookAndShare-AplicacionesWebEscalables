import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // Importamos RouterLink para el botón del Hero
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css']
})
export class HomeComponent {
  // Datos temporales
  recetasDestacadas = [
    { id: 1, titulo: 'Tacos al pastor', descripcion: 'Auténticos tacos mexicanos con piña.', imagen: '/img/tacos.jpeg' },
    { id: 2, titulo: 'Panqué de plátano', descripcion: 'Esponjoso y dulce.', imagen: '/img/panque.jpeg' },
    { id: 3, titulo: 'Limonada de menta', descripcion: 'Refrescante bebida natural.', imagen: '/img/limonada.jpeg' }
  ];
}