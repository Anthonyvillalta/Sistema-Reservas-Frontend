import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile">
      <div class="profile-header">
        <div class="profile-avatar">{{ initials }}</div>
        <h2 class="profile-name">{{ userName }}</h2>
        <span class="profile-email">{{ userEmail }}</span>
      </div>

      <div class="profile-menu">
        <button class="menu-item" (click)="goTo('my-reservations')">
          <span class="menu-icon">📅</span>
          <span class="menu-label">Mis reservas</span>
          <span class="menu-arrow">→</span>
        </button>

        <button class="menu-item" (click)="goTo('payment-methods')">
          <span class="menu-icon">💳</span>
          <span class="menu-label">Métodos de pago</span>
          <span class="menu-arrow">→</span>
        </button>

        <button class="menu-item" (click)="goTo('notifications')">
          <span class="menu-icon">🔔</span>
          <span class="menu-label">Notificaciones</span>
          <span class="menu-arrow">→</span>
        </button>

        <button class="menu-item" (click)="goTo('settings')">
          <span class="menu-icon">⚙️</span>
          <span class="menu-label">Configuración</span>
          <span class="menu-arrow">→</span>
        </button>

        <button class="menu-item menu-item--danger" (click)="logout()">
          <span class="menu-icon">🚪</span>
          <span class="menu-label">Cerrar sesión</span>
          <span class="menu-arrow">→</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile { display: flex; flex-direction: column; gap: var(--space-6); }
    .profile-header { text-align: center; padding: var(--space-6) 0; }
    .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: var(--text-2xl); font-weight: 700; margin: 0 auto var(--space-4); }
    .profile-name { font-size: var(--text-xl); font-weight: 700; }
    .profile-email { font-size: var(--text-sm); color: var(--color-text-secondary); }
    .profile-menu { display: flex; flex-direction: column; gap: var(--space-2); }
    .menu-item { display: flex; align-items: center; gap: var(--space-3); padding: 16px; background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: none; cursor: pointer; font-family: var(--font-family); font-size: var(--text-base); transition: all var(--transition-fast); width: 100%; text-align: left; }
    .menu-item:active { transform: scale(0.98); }
    .menu-icon { font-size: 1.25rem; }
    .menu-label { flex: 1; font-weight: 500; }
    .menu-arrow { color: var(--color-text-tertiary); }
    .menu-item--danger .menu-label { color: var(--color-danger); }
  `]
})
export class ProfileComponent implements OnInit {
  initials = '?';
  userName = '';
  userEmail = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nombreCompleto;
      this.userEmail = user.email;
      this.initials = user.nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
  }

  goTo(section: string): void {
    if (section === 'my-reservations') this.router.navigate(['/m/mis-reservas']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/m/login']);
  }
}
