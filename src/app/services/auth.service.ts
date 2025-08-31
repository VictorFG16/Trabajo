import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private apiService: ApiService, private http: HttpClient) {}

  login(userName: string, password: string) {
    return this.apiService.post('/auth/login', { userName, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userName', userName); // opcional pero útil
      })
    );
  }

  getCurrentUser() {
    const name = localStorage.getItem('userName') || 'anonymous';
    // Reutiliza ApiService (baseUrl + /api)
    return this.apiService.get(`/users/by-name/${encodeURIComponent(name)}`) as unknown as import('rxjs').Observable<User>;
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }
}
