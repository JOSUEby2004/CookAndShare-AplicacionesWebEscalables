import { Routes } from '@angular/router';
import { HomeComponent } from './views/home-component/home-component';
import { CatalogoComponent } from './views/catalogo-component/catalogo-component';
import { DetalleComponent } from './views/detalle-component/detalle-component';
import { LoginComponent } from './views/login-component/login-component';
import { RegistroComponent } from './views/registro-component/registro-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'detalle/:id', component: DetalleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  // Ruta "comodín": si escriben una URL que no existe, los manda al inicio
  { path: '**', redirectTo: '' } 
];