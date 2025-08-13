import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  // Método para iniciar sesión
  login(email: string, password: string) {
    return this.apiService.post('/auth/login', { email, password });
  }

}
