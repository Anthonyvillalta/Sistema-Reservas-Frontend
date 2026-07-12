import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnvironmentService } from '../../core/services/environment.service';
import { Environment } from '../../models/environment.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-environment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>Ambientes</h1>
        <a *ngIf="authService.isAdmin()" routerLink="/ambientes/nuevo" class="btn-primary btn-sm">+ Nuevo</a>
      </div>

      <div class="grid-2">
        <div *ngFor="let env of environments" class="env-card card">
          <div class="env-header">
            <h3>{{ env.nombre }}</h3>
            <span class="badge" [class.badge-confirmado]="env.estado === 'ACTIVO'" [class.badge-cancelado]="env.estado !== 'ACTIVO'">
              {{ env.estado }}
            </span>
          </div>

          <div class="env-body">
            <div class="env-meta">
              <span class="env-type">{{ env.tipo === 'EVENTO' ? 'Por evento' : 'Por horas' }}</span>
              <span class="env-price">S/ {{ env.precioBase.toFixed(2) }}</span>
            </div>
            <p class="env-desc" *ngIf="env.descripcion">{{ env.descripcion }}</p>
            <span class="env-capacity" *ngIf="env.capacidadMaxima">Capacidad: {{ env.capacidadMaxima }} personas</span>
          </div>

          <div class="env-actions" *ngIf="authService.isAdmin()">
            <a [routerLink]="['/ambientes', env.id, 'editar']" class="btn-outline">Editar</a>
            <button (click)="toggleStatus(env)" class="btn-outline">
              {{ env.estado === 'ACTIVO' ? 'Suspender' : 'Activar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .env-card { display: flex; flex-direction: column; gap: 12px; }
    .env-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .env-header h3 { font-size: 1.1rem; font-weight: 600; }
    .env-body { display: flex; flex-direction: column; gap: 8px; }
    .env-meta { display: flex; justify-content: space-between; align-items: center; }
    .env-type { font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; }
    .env-price { font-size: 1.3rem; font-weight: 700; color: var(--primary); }
    .env-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
    .env-capacity { font-size: 0.8rem; color: var(--text-light); }
    .env-actions { display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border); }
    .btn-outline {
      padding: 8px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
      text-decoration: none;
      color: var(--text-primary);
    }
    .btn-outline:hover { background: var(--background); }
    .btn-sm { padding: 8px 20px; font-size: 0.85rem; text-decoration: none; }
  `],
})
export class EnvironmentListComponent implements OnInit {
  environments: Environment[] = [];

  constructor(
    public environmentService: EnvironmentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEnvironments();
  }

  loadEnvironments(): void {
    this.environmentService.findAll().subscribe((data) => {
      this.environments = data;
    });
  }

  toggleStatus(env: Environment): void {
    const newStatus = env.estado === 'ACTIVO' ? 'MANTENIMIENTO' : 'ACTIVO';
    this.environmentService.updateStatus(env.id!, newStatus).subscribe(() => {
      this.loadEnvironments();
    });
  }
}
