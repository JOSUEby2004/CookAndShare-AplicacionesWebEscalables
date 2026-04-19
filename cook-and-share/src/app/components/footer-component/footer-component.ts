import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer-component.html',
  styleUrls: ['./footer-component.css']
})
export class FooterComponent {
  // Un pequeño detalle dinámico: obtener el año actual automáticamente
  anioActual = new Date().getFullYear();
}