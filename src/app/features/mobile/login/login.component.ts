import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mobile-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mobile-login">
      <div class="login-header">
        <div class="login-logo">🌿</div>
        <h1 class="login-title">Campestre<br/>José Antonio</h1>
        <p class="login-subtitle">Inicia sesión para gestionar tus reservas</p>
      </div>

      <form (ngSubmit)="onSubmit()" class="login-form">
        <div class="field">
          <label class="field-label">Correo electrónico</label>
          <input type="email" [(ngModel)]="email" name="email" class="field-input" placeholder="tu@correo.com" required autocomplete="email" />
        </div>

        <div class="field">
          <label class="field-label">Contraseña</label>
          <div class="password-field">
            <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" class="field-input" placeholder="Ingresa tu contraseña" required autocomplete="current-password" />
            <button type="button" class="password-toggle" (click)="showPassword = !showPassword">
              <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>

        <div class="login-options">
          <label class="checkbox-label">
            <input type="checkbox" [(ngModel)]="remember" name="remember" />
            <span>Recordarme</span>
          </label>
          <button type="button" class="link-btn">¿Olvidaste tu contraseña?</button>
        </div>

        <div class="error-msg" *ngIf="error">{{ error }}</div>

        <button type="submit" class="btn-login" [disabled]="loading">
          <span *ngIf="loading" class="spinner"></span>
          <span *ngIf="!loading">Ingresar</span>
          <span *ngIf="loading">Ingresando...</span>
        </button>
      </form>

      <div class="login-footer">
        <p>¿No tienes cuenta? <button class="link-btn" (click)="register()">Regístrate</button></p>
      </div>
    </div>
  `,
  styles: [`
    .mobile-login {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: var(--space-6);
      background: white;
    }
    .login-header { text-align: center; margin-bottom: var(--space-8); }
    .login-logo { font-size: 3rem; margin-bottom: var(--space-4); }
    .login-title { font-size: 1.5rem; font-weight: 700; color: var(--color-primary); line-height: 1.3; }
    .login-subtitle { font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: var(--space-2); }
    .login-form { display: flex; flex-direction: column; gap: var(--space-5); }
    .field { display: flex; flex-direction: column; gap: var(--space-2); }
    .field-label { font-size: var(--text-sm); font-weight: 600; color: var(--color-text-primary); }
    .field-input {
      width: 100%; padding: 14px 16px;
      border: 2px solid var(--color-border); border-radius: var(--radius-md);
      font-size: var(--text-base); font-family: var(--font-family); outline: none;
      transition: border-color var(--transition-fast);
      background: var(--color-background);
    }
    .field-input:focus { border-color: var(--color-primary); background: white; }
    .password-field { position: relative; }
    .password-toggle {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; color: var(--color-text-tertiary); padding: 4px;
    }
    .login-options { display: flex; justify-content: space-between; align-items: center; font-size: var(--text-sm); }
    .checkbox-label { display: flex; align-items: center; gap: var(--space-2); cursor: pointer; color: var(--color-text-secondary); }
    .link-btn { background: none; border: none; color: var(--color-primary); cursor: pointer; font-family: var(--font-family); font-size: var(--text-sm); font-weight: 500; padding: 0; }
    .error-msg { padding: 12px; background: var(--color-danger-light); color: var(--color-danger); border-radius: var(--radius-md); font-size: var(--text-sm); text-align: center; }
    .btn-login {
      width: 100%; padding: 16px; background: var(--color-primary); color: white; border: none;
      border-radius: var(--radius-md); font-size: var(--text-lg); font-weight: 600; cursor: pointer;
      font-family: var(--font-family); transition: background var(--transition-fast);
      display: flex; align-items: center; justify-content: center; gap: var(--space-2);
    }
    .btn-login:hover:not(:disabled) { background: var(--color-primary-hover); }
    .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
    .login-footer { text-align: center; margin-top: var(--space-8); font-size: var(--text-sm); color: var(--color-text-secondary); }
    .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
  `]
})
export class MobileLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;
  remember = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) { this.error = 'Todos los campos son obligatorios'; return; }
    this.loading = true; this.error = '';
    this.authService.login({ username: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/m/home']),
      error: () => { this.loading = false; this.error = 'Credenciales inválidas'; }
    });
  }

  register(): void {
    this.router.navigate(['/login']);
  }
}
