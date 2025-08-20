import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  // Método para iniciar sesión
  login(userName: string, password: string) {
    return this.apiService.post('/auth/login', { userName, password });
  }

  getCurrentUser() {
    return this.http.get<User>('http://localhost:8080/api/users/me');
  }

}
