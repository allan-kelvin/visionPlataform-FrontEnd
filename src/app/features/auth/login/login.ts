import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginRequest } from '../../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {

    if (this.loginForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.loginError = false;

    const request: LoginRequest = this.loginForm.value;

    this.authService.login(request).subscribe({

      next: () => {
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {

        console.error(err);

        this.loading = false;
        this.loginError = true;
      }
    });
  }
}

