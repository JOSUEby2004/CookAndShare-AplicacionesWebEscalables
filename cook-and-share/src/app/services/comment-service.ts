import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/comentarios';

  // Obtener comentarios de una receta específica
  getComentarios(recetaId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${recetaId}`);
  }

  // Enviar un nuevo comentario
  postComentario(recetaId: string, texto: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Enviamos el cuerpo que espera el backend
    return this.http.post(this.apiUrl, { recetaId, texto }, { headers });
  }
}
