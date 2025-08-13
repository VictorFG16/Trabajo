import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  providers: [AuthService],
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  private router = inject(Router);
  private authService = inject(AuthService);

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Login exitoso con backend Java
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // Error del backend Java
        this.errorMessage = error.error?.error || 'Credenciales inválidas';
      },
    });
  }
}
