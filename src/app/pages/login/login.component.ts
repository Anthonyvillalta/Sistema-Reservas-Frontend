import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { DeviceService } from '../../core/services/device.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <aside class="login-hero">
        <div class="hero-blob hero-blob-1"></div>
        <div class="hero-blob hero-blob-2"></div>
        <div class="hero-blob hero-blob-3"></div>

        <div class="hero-content">
          <div class="hero-logo-ring">
            <span class="hero-logo">🌿</span>
          </div>
          <h1 class="hero-title">Campestre<br/>José Antonio</h1>
          <p class="hero-tagline">Centro Recreacional</p>
          <p class="hero-subtitle">Sistema de Gestión de Alquileres</p>

          <div class="hero-chips">
            <span class="hero-chip">
              <span class="material-icons">calendar_month</span>
              Reservas
            </span>
            <span class="hero-chip">
              <span class="material-icons">location_city</span>
              Ambientes
            </span>
            <span class="hero-chip">
              <span class="material-icons">payments</span>
              Pagos
            </span>
          </div>
        </div>
      </aside>

      <main class="login-main">
        <div class="login-card">
          <div class="card-header">
            <div class="card-logo-mobile">🌿</div>
            <h2 class="card-title">Bienvenido</h2>
            <p class="card-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="field anim-field-1">
              <label class="field-label">Usuario</label>
              <div class="input-wrapper">
                <span class="material-icons input-icon">person</span>
                <input
                  type="text"
                  [(ngModel)]="username"
                  name="username"
                  placeholder="Ingrese su usuario"
                  required
                  autocomplete="username"
                  class="field-input"
                />
              </div>
            </div>

            <div class="field anim-field-2">
              <label class="field-label">Contraseña</label>
              <div class="input-wrapper">
                <span class="material-icons input-icon">lock</span>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  required
                  autocomplete="current-password"
                  class="field-input field-input-password"
                />
                <button type="button" class="password-toggle" (click)="showPassword = !showPassword" tabindex="-1">
                  <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div class="error-message anim-field-3" *ngIf="error">{{ error }}</div>

            <button type="submit" class="btn-primary anim-field-4" [disabled]="loading">
              <span *ngIf="loading" class="spinner"></span>
              <span *ngIf="!loading">Iniciar Sesión</span>
              <span *ngIf="loading">Ingresando...</span>
            </button>

            <button type="button" class="btn-mobile anim-field-5" *ngIf="isMobile" (click)="goMobile()">
              Ingresar como invitado
            </button>
          </form>

          <div class="login-footer">
            <p>Centro Recreacional Campestre José Antonio</p>
            <p class="copyright">© 2026 Todos los derechos reservados</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ===== Page layout ===== */
    .login-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    /* ===== Hero panel ===== */
    .login-hero {
      display: none;
      position: relative;
      flex: 1;
      background:
        radial-gradient(ellipse at 20% 80%, rgba(16, 185, 129, 0.35) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(37, 99, 235, 0.4) 0%, transparent 50%),
        linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, #3B82F6 100%);
      overflow: hidden;
      animation: slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .hero-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.5;
      pointer-events: none;
    }
    .hero-blob-1 {
      width: 320px; height: 320px;
      background: var(--color-success);
      top: -80px; right: -60px;
      animation: floatBlob 8s ease-in-out infinite;
    }
    .hero-blob-2 {
      width: 240px; height: 240px;
      background: #60A5FA;
      bottom: 10%; left: -40px;
      animation: floatBlob 10s ease-in-out infinite reverse;
    }
    .hero-blob-3 {
      width: 180px; height: 180px;
      background: rgba(255, 255, 255, 0.15);
      top: 40%; right: 20%;
      animation: floatBlob 12s ease-in-out infinite 2s;
    }

    @keyframes floatBlob {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(20px, -15px) scale(1.05); }
      66% { transform: translate(-10px, 10px) scale(0.95); }
    }

    .hero-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: var(--space-10);
      text-align: center;
    }

    .hero-logo-ring {
      width: 88px; height: 88px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.12);
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      margin-bottom: var(--space-6);
    }
    .hero-logo { font-size: 2.75rem; line-height: 1; }

    .hero-title {
      font-size: var(--text-3xl);
      font-weight: 700;
      color: white;
      line-height: 1.25;
      margin-bottom: var(--space-2);
    }
    .hero-tagline {
      font-size: var(--text-lg);
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      margin-bottom: var(--space-1);
    }
    .hero-subtitle {
      font-size: var(--text-sm);
      color: rgba(255, 255, 255, 0.65);
      margin-bottom: var(--space-8);
    }

    .hero-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-3);
      justify-content: center;
    }
    .hero-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-full);
      color: white;
      font-size: var(--text-sm);
      font-weight: 500;
      backdrop-filter: blur(8px);
    }
    .hero-chip .material-icons { font-size: 18px; }

    /* ===== Main / form panel ===== */
    .login-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      background: var(--color-surface);
      position: relative;
    }

    /* Mobile animated background */
    .login-main::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 30% 70%, rgba(16, 185, 129, 0.25) 0%, transparent 55%),
        radial-gradient(ellipse at 70% 30%, rgba(29, 78, 216, 0.3) 0%, transparent 55%),
        linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, #3B82F6 100%);
      z-index: 0;
    }
    .login-main::after {
      content: '';
      position: absolute;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: var(--color-success);
      filter: blur(80px);
      opacity: 0.3;
      top: -60px; right: -40px;
      z-index: 0;
      animation: floatBlob 9s ease-in-out infinite;
    }

    .login-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: var(--space-10) var(--space-8);
      border-radius: var(--radius-xl);
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
      opacity: 0;
    }

    .card-header { text-align: center; margin-bottom: var(--space-8); }
    .card-logo-mobile {
      font-size: 2.5rem;
      margin-bottom: var(--space-3);
      display: block;
    }
    .card-title {
      font-size: var(--text-2xl);
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: var(--space-1);
    }
    .card-subtitle {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }

    /* ===== Form fields ===== */
    .login-form { display: flex; flex-direction: column; gap: var(--space-5); }

    .field { display: flex; flex-direction: column; gap: var(--space-2); }
    .field-label {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      font-size: 20px;
      color: var(--color-text-tertiary);
      pointer-events: none;
      transition: color var(--transition-fast);
    }
    .input-wrapper:focus-within .input-icon { color: var(--color-primary); }

    .field-input {
      width: 100%;
      padding: 13px 16px 13px 46px;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--text-base);
      font-family: var(--font-family);
      background: var(--color-background);
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
      outline: none;
    }
    .field-input-password { padding-right: 46px; }
    .field-input:focus {
      border-color: var(--color-primary);
      background: white;
      box-shadow: 0 0 0 4px var(--color-primary-light);
    }
    .field-input::placeholder { color: var(--color-text-tertiary); }

    .password-toggle {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-tertiary);
      padding: 4px;
      display: flex;
      align-items: center;
      transition: color var(--transition-fast);
    }
    .password-toggle:hover { color: var(--color-primary); }
    .password-toggle .material-icons { font-size: 20px; }

    /* ===== Buttons ===== */
    .btn-primary {
      padding: 15px;
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-hover) 100%);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--text-base);
      font-weight: 600;
      cursor: pointer;
      font-family: var(--font-family);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      box-shadow: 0 4px 14px rgba(29, 78, 216, 0.4);
      transition: transform var(--transition-fast), box-shadow var(--transition-base), opacity var(--transition-fast);
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(29, 78, 216, 0.5);
    }
    .btn-primary:active:not(:disabled) { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .btn-mobile {
      padding: 13px;
      background: transparent;
      color: var(--color-text-secondary);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-weight: 500;
      cursor: pointer;
      font-family: var(--font-family);
      width: 100%;
      transition: border-color var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
    }
    .btn-mobile:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: var(--color-primary-light);
    }

    /* ===== Error & footer ===== */
    .error-message {
      padding: 12px;
      background: var(--color-danger-light);
      color: var(--color-danger);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      text-align: center;
      animation: fadeIn 0.25s ease forwards;
    }

    .login-footer {
      text-align: center;
      margin-top: var(--space-6);
      color: var(--color-text-tertiary);
      font-size: var(--text-xs);
    }
    .login-footer p { margin-top: var(--space-1); }

    .spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    /* ===== Staggered field animations ===== */
    .anim-field-1 { animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards; opacity: 0; }
    .anim-field-2 { animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards; opacity: 0; }
    .anim-field-3 { animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.35s forwards; opacity: 0; }
    .anim-field-4 { animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards; opacity: 0; }
    .anim-field-5 { animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards; opacity: 0; }

    /* ===== Desktop split-screen ===== */
    @media (min-width: 900px) {
      .login-page { flex-direction: row; }

      .login-hero {
        display: flex;
        flex: 1;
        max-width: 50%;
      }

      .login-main {
        flex: 1;
        max-width: 50%;
        background: var(--color-surface);
      }
      .login-main::before,
      .login-main::after { display: none; }

      .login-card {
        max-width: 400px;
        background: var(--color-surface);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: none;
        box-shadow: none;
        padding: var(--space-8) var(--space-6);
      }

      .card-logo-mobile { display: none; }
    }

    /* ===== Small mobile ===== */
    @media (max-width: 480px) {
      .login-main { padding: var(--space-4); }
      .login-card { padding: var(--space-8) var(--space-5); }
      .hero-chips { display: none; }
    }
  `],
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';
  isMobile = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private deviceService: DeviceService
  ) {
    this.deviceService.isMobile$.subscribe(m => this.isMobile = m);
  }

  onSubmit(): void {
    if (!this.username || !this.password) { this.error = 'Todos los campos son obligatorios'; return; }
    this.loading = true; this.error = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (user?.role === 'CLIENT') this.router.navigate(['/m/home']);
        else this.router.navigate(['/dashboard']);
      },
      error: () => { this.loading = false; this.error = 'Credenciales inválidas'; },
    });
  }

  goMobile(): void {
    this.router.navigate(['/m/splash']);
  }
}
