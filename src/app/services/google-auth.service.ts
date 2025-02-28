import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private backendUrl = 'http://localhost:8080/oauth2/authorization/google';
  private userData: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  loginWithGoogle() {
    window.location.href = this.backendUrl; // Redireciona para o login no backend
  }

  fetchUserData() {
    return this.http.get('http://localhost:8080/auth/login').subscribe((res: any) => {
      localStorage.setItem('token', res.token);
      this.userData = res;
      this.router.navigate(['/dashboard']); // Redireciona para uma página após login
    });
  }

  getUserData() {
    return this.userData;
  }

  logout() {
    localStorage.removeItem('token');
    this.userData = null;
    this.router.navigate(['/']);
  }
}
