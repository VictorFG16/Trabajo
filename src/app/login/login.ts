import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  userName = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private sessionService: SessionService  ,private router: Router) {}

  onLogin() {
  this.authService.login(this.userName, this.password).subscribe({
    next: () => {
      this.router.navigate(['/home']); 
    },
    error: () => {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  });
}

ngOnInit() {
  if (this.authService.isLoggedIn()) {
    this.sessionService.resetTimer();
    this.router.navigate(['/home']); 
  }
}
}
