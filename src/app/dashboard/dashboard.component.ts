import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div *ngIf="user">
      <h2>Bem-vindo, {{ user.name }}</h2>
      <img [src]="user.picture" alt="Foto do perfil">
      <p>Email: {{ user.email }}</p>
      <button (click)="logout()">Sair</button>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user: any;

  constructor(private authService: GoogleAuthService) {}

  ngOnInit() {
    this.user = this.authService.getUserData();
  }

  logout() {
    this.authService.logout();
  }
}
