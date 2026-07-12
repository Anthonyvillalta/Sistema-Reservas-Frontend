import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.sidebar--open]="open">
      <div class="sidebar-brand">
        <div class="brand-icon">🌿</div>
        <div class="brand-text">
          <strong>Centro Recreacional</strong>
          <span>José Antonio</span>
          <small>Sistema de Alquileres</small>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">grid_view</span>
          <span>Dashboard</span>
        </a>
        <a routerLink="/reservas" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">calendar_month</span>
          <span>Reservas</span>
        </a>
        <a routerLink="/calendario" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">view_week</span>
          <span>Calendario</span>
        </a>
        <a routerLink="/ambientes" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">location_city</span>
          <span>Ambientes</span>
        </a>
        <a routerLink="/clientes" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">people</span>
          <span>Clientes</span>
        </a>
        <a routerLink="/pagos" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">payments</span>
          <span>Pagos</span>
        </a>
        <a routerLink="/mantenimientos" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">construction</span>
          <span>Mantenimiento</span>
        </a>
        <a routerLink="/reportes" routerLinkActive="active" class="nav-item" *ngIf="authService.isAdmin()" (click)="close.emit()">
          <span class="material-icons">assessment</span>
          <span>Reportes</span>
        </a>
        <a routerLink="/notificaciones" routerLinkActive="active" class="nav-item" (click)="close.emit()">
          <span class="material-icons">notifications</span>
          <span>Notificaciones</span>
        </a>
      </nav>

      <div class="sidebar-user">
        <!-- Avatar removed -->
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ roleLabel }}</span>
        </div>
        <span class="user-status"><span class="status-dot"></span> En línea</span>
        <button class="logout-btn" (click)="logout()" title="Cerrar sesión">
          <span class="material-icons">logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: var(--sidebar-width);
      background: var(--sidebar-bg);
      color: var(--sidebar-text);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    .sidebar-brand {
      padding: var(--space-5) var(--space-4);
      display: flex; align-items: center; gap: var(--space-3);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .brand-icon {
      width: 40px; height: 40px; border-radius: var(--radius-md);
      background: rgba(29,78,216,0.2);
      display: flex; align-items: center; justify-content: center; font-size: 1.25rem;
    }
    .brand-text { display: flex; flex-direction: column; line-height: 1.3; }
    .brand-text strong { font-size: var(--text-sm); color: white; font-weight: 700; }
    .brand-text span { font-size: var(--text-xs); color: #CBD5E1; font-weight: 600; }
    .brand-text small { font-size: 10px; color: var(--sidebar-text); margin-top: 2px; }

    .sidebar-nav { flex: 1; padding: var(--space-4) var(--space-3); display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex; align-items: center; gap: var(--space-3);
      padding: 11px var(--space-4);
      color: var(--sidebar-text); text-decoration: none;
      border-radius: var(--radius-md);
      font-size: var(--text-sm); font-weight: 500;
      transition: all var(--transition-fast);
    }
    .nav-item .material-icons { font-size: 20px; }
    .nav-item:hover { background: var(--sidebar-bg-hover); color: white; }
    .nav-item.active {
      background: var(--sidebar-active);
      color: var(--sidebar-text-active);
      box-shadow: 0 4px 12px rgba(29,78,216,0.35);
    }

    .sidebar-user {
      margin: var(--space-3);
      padding: var(--space-4);
      background: var(--sidebar-bg-hover);
      border-radius: var(--radius-lg);
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;
      gap: var(--space-2) var(--space-3);
      align-items: center;
    }
    /* Avatar removed */
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: var(--text-sm); font-weight: 600; color: white; }
    .user-role { font-size: var(--text-xs); color: var(--sidebar-text); }
    .user-status {
      grid-column: 2;
      font-size: 11px; color: var(--color-success);
      display: flex; align-items: center; gap: 6px;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-success); }
    .logout-btn {
      grid-row: 1 / 3; grid-column: 3;
      background: none; border: none; color: var(--sidebar-text);
      cursor: pointer; padding: 4px; border-radius: var(--radius-sm);
      display: flex; align-items: center;
    }
    .logout-btn:hover { color: #FCA5A5; background: rgba(255,255,255,0.05); }
    .logout-btn .material-icons { font-size: 20px; }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .sidebar--open { display: flex; z-index: 1000; }
    }
  `],
})
export class SidebarComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  constructor(public authService: AuthService, private router: Router) {}

  get userName(): string { return this.authService.getCurrentUser()?.nombreCompleto || 'Usuario'; }
  get roleLabel(): string {
    const role = this.authService.getCurrentUser()?.role;
    return role === 'ADMIN' ? 'Administrador' : role === 'ASISTENTE' ? 'Asistente' : 'Cliente';
  }
  get initials(): string {
    const user = this.authService.getCurrentUser();
    if (!user?.nombreCompleto) return '?';
    return user.nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
