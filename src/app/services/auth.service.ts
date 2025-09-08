import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { tap } from 'rxjs/operators'; // Importar tap

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  // Método para iniciar sesión
  login(userName: string, password: string) {
    return this.apiService.post('/auth/login', { userName, password }).pipe(
      tap((response: any) => {
        // Almacenar el token en el almacenamiento local
        localStorage.setItem('token', response.token);
      })
    );
  }

  // Lee el nombre guardado y consulta el backend
  getCurrentUser() {
    const name = localStorage.getItem('userName');
    if (!name) {
      // devuelve observable con usuario genrico
      return this.http.get<User>(`http://localhost:8080/api/users/by-name/anonymous`, { observe: 'body' as const });
    }
    return this.http.get<User>(`http://localhost:8080/api/users/by-name/${encodeURIComponent(name)}`);
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }

}