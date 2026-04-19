import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  // La URL base de tu backend local
  private apiUrl = 'http://localhost:3000/api/auth';

  // Método que recibe el formulario y hace la petición POST a Node.js
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  // Método auxiliar para guardar el token VIP en el navegador
  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Guardamos los datos del usuario en el LocalStorage cuando éste inicia sesión
  guardarUsuario(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  // Método para registrar un nuevo usuario
  registrar(nuevoUsuario: any): Observable<any> {
    // Apuntamos a http://localhost:3000/api/auth/registro
    return this.http.post(`${this.apiUrl}/registro`, nuevoUsuario);
  }

  obtenerUsuario() {
    const usuarioString = localStorage.getItem('usuario');
    return usuarioString ? JSON.parse(usuarioString) : null;
  }

  // Obtener todos los usuarios (Exclusivo para Administradores)
  getTodosLosUsuarios(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, { headers });
  }

  // Pedir datos frescos a la base de datos
  getMiPerfil(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/perfil`, { headers });
  }

  // Actualizar datos del usuario (Foto y/o Nombre)
  actualizarPerfil(datos: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/perfil`, datos, { headers });
  }

  // Borrar usuario (Exclusivo para Administradores)
  eliminarUsuarioAdmin(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, { headers });
  }
}