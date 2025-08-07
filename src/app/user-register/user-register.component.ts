import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  imports: [ReactiveFormsModule],
  template: `
  <section>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <div class="form-container">
        <ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab" aria-controls="login" aria-selected="true">Login</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab" aria-controls="register" aria-selected="false">Register</button>
            </li>
        </ul>
    </div>
  </section>
  `,
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {

  applyForm = new FormGroup({
    loginEmail: new FormControl(''),
    loginPassword: new FormControl(''),
  });

  /* comentado pois não é mais utilizado
  async submitLogin(){
    const login = this.applyForm.value.loginEmail ?? ''
    const password = this.applyForm.value.loginPassword ?? ''
    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jndb-token', data.token);
        alert('Login successful!');
        window.location.href = 'http://localhost:4200';
        
    } else {
        alert('Login failed. Please try again.');
    }
            

  }
    */

  async submitRegister(){
    const token = localStorage.getItem('jndb-token');
    const response = await fetch('/register', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Registration successful!');
        window.location.href = '/home'
    } else {
        alert('Registration failed. Please try again.');
    }
    
  }

}
