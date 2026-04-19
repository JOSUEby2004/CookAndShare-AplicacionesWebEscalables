import { Routes } from '@angular/router';
import { HomeComponent } from './views/home-component/home-component';
import { CatalogoComponent } from './views/catalogo-component/catalogo-component';
import { DetalleComponent } from './views/detalle-component/detalle-component';
import { LoginComponent } from './views/login-component/login-component';
import { RegistroComponent } from './views/registro-component/registro-component';
import { CrearRecetaComponent } from './views/crear-receta-component/crear-receta-component';
import { EditarRecetaComponent } from './views/editar-receta-component/editar-receta-component';
import { PerfilComponent } from './views/perfil-component/perfil-component';
import { AdminComponent } from './views/admin-component/admin-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'detalle/:id', component: DetalleComponent },
  { path: 'crear-receta', component: CrearRecetaComponent},
  { path: 'editar-receta/:id', component: EditarRecetaComponent},
  { path: 'admin', component: AdminComponent },
  // Ruta "comodín": si escriben una URL que no existe, los manda al inicio
  { path: '**', redirectTo: '' } 
];