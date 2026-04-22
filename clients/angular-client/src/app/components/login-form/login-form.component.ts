/**
 * Login Form Component
 * Handles user authentication
 */

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  @Output() loginSubmit = new EventEmitter<{ email: string; password: string }>();

  email = environment.testCredentials?.email || '';
  password = environment.testCredentials?.password || '';
  loading = false;

  onSubmit(): void {
    if (this.email && this.password) {
      this.loading = true;
      this.loginSubmit.emit({ email: this.email, password: this.password });
    }
  }

  setLoading(loading: boolean): void {
    this.loading = loading;
  }
}
