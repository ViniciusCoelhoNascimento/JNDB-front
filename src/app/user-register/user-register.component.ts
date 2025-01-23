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
        <div class="tab-content" id="myTabContent">
            <!-- Login Form -->
            <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
                <form [formGroup]="applyForm" (submit)="submitLogin()">
                    <div class="mb-3">
                        <label for="loginEmail" class="form-label">Login</label>
                        <input type="text" class="form-control" id="loginEmail" formControlName="loginEmail" placeholder="Enter your login">
                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="loginPassword" formControlName="loginPassword" placeholder="Enter your password">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                </form>
            </div>

            <!-- Register Form -->
            <div class="tab-pane fade" id="register" role="tabpanel" aria-labelledby="register-tab">
                <form>
                    <div class="mb-3">
                        <label for="registerName" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="registerName" formControlName="registerName" placeholder="Enter your name">
                    </div>
                    <div class="mb-3">
                        <label for="registerEmail" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="registerEmail" formControlName="registerEmail" placeholder="Enter your email">
                    </div>
                    <div class="mb-3">
                        <label for="registerPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" id="registerPassword" formControlName="registerPassword" placeholder="Create a password">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirmPassword" formControlName="confirmPassword" placeholder="Confirm your password">
                    </div>
                    <button type="button" class="btn btn-success w-100" onclick="submitRegister()">Register</button>
                </form>
            </div>
        </div>
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

  async submitRegister(){
    /*
                const name = document.getElementById('registerName').value;
            const login = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            let role = 'USER'

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password, role })
            });

            if (response.ok) {
                alert('Registration successful!');
                window.location.href = '/home'
            } else {
                alert('Registration failed. Please try again.');
            }
    */
  }

}
