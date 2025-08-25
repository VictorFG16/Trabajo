import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => this.userName = user?.name || localStorage.getItem('userName') || 'Perfil',
      error: () => this.userName = localStorage.getItem('userName') || 'Perfil'
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  formatUserName(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
