import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/recetas';

  // Obtenemos el arreglo de recetas desde Node.js
  getRecetas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtenemos SOLO las recetas del usuario logueado
  getMisRecetas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/mis-recetas`, { headers });
  }

  // Obtener todas las recetas (Solo Admin)
  getTodasLasRecetasAdmin(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/admin/todas`, { headers });
  }

  //Obtenemos SOLO una receta en específico
  getRecetaById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Método para enviar la receta al Backend
  crearReceta(receta: any): Observable<any> {
    const token = localStorage.getItem('token');
    // Creamos la cabecera con el token VIP (Alguien que sí tiene permisos)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl, receta, { headers });
  }

  // Actualizar receta existente (PUT)
  actualizarReceta(id: string, recetaActualizada: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, recetaActualizada, { headers });
  }

  // Cambiar estado de una receta
  cambiarEstado(id: string, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado }, { headers });
  }

  // Borrar receta
  eliminarReceta(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
