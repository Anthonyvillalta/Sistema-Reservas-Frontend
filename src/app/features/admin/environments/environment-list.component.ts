import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnvironmentService } from '../../../core/services/environment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Environment } from '../../../models/environment.model';
import { EnvironmentCardComponent } from '../../../shared/components/environment-card/environment-card.component';

@Component({
  selector: 'app-environment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EnvironmentCardComponent],
  template: `
    <div class="el">
      <!-- Header -->
      <div class="el-header">
        <div>
          <h1 class="el-title">Ambientes</h1>
          <p class="el-subtitle">Gestiona los espacios disponibles</p>
        </div>
        <a *ngIf="authService.isAdmin()" routerLink="/ambientes/nuevo" class="el-cta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo
        </a>
      </div>

      <!-- Search -->
      <div class="el-search">
        <svg class="el-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearch($event)" class="el-search-input" placeholder="Buscar espacios disponibles..." autocomplete="off" />
      </div>

      <!-- Filters -->
      <div class="el-filters">
        <button class="el-filter" [class.el-filter--active]="filter === 'todos'" (click)="filter = 'todos'; loadEnvironments()">Todos</button>
        <button class="el-filter" [class.el-filter--active]="filter === 'activos'" (click)="filter = 'activos'; loadEnvironments()">Disponibles</button>
        <button class="el-filter" [class.el-filter--active]="filter === 'mantenimiento'" (click)="filter = 'mantenimiento'; loadEnvironments()">Mantenimiento</button>
      </div>

      <!-- Grid -->
      <div class="el-grid" *ngIf="filteredEnvs.length > 0">
        <app-environment-card *ngFor="let env of filteredEnvs; let i = index" [environment]="env" [style.animation-delay]="0.04 * i + 's'">
          <a *ngIf="authService.isAdmin()" [routerLink]="['/ambientes', env.id, 'editar']" class="btn-outline">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar
          </a>
          <button *ngIf="authService.isAdmin()" (click)="toggleStatus(env)" class="btn-outline">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            {{ env.estado === 'ACTIVO' ? 'Suspender' : 'Activar' }}
          </button>
        </app-environment-card>
      </div>

      <!-- Empty -->
      <div class="el-empty" *ngIf="filteredEnvs.length === 0">
        <div class="el-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <p class="el-empty-text">No se encontraron ambientes</p>
      </div>
    </div>
  `,
  styles: [`
    .el { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; padding-bottom: 24px; animation: elFade 0.3s ease both; }
    @keyframes elFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .el-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; }
    .el-title { font-size: 22px; font-weight: 700; color: #1E293B; margin: 0; line-height: 1.2; }
    .el-subtitle { font-size: 13px; color: #94A3B8; margin: 2px 0 0; }
    .el-cta { display: inline-flex; align-items: center; gap: 6px; padding: 11px 16px; background: #2563EB; color: #fff; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 12px rgba(37,99,235,0.25); transition: all 0.2s; flex-shrink: 0; }
    .el-cta:active { transform: scale(0.95); }
    .el-search { position: relative; display: flex; align-items: center; background: #fff; border-radius: 14px; padding: 0 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .el-search-icon { color: #94A3B8; flex-shrink: 0; pointer-events: none; }
    .el-search-input { width: 100%; height: 46px; padding: 0 12px; border: none; border-radius: 14px; font-size: 14px; font-weight: 500; font-family: inherit; background: transparent; color: #1E293B; outline: none; }
    .el-search-input:focus { box-shadow: 0 0 0 3px rgba(37,99,235,0.12); border-radius: 14px; }
    .el-search-input::placeholder { color: #94A3B8; font-weight: 400; }
    .el-filters { display: flex; gap: 8px; }
    .el-filter { padding: 7px 16px; border: none; background: #fff; border-radius: 20px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; color: #64748B; transition: all 0.15s; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .el-filter--active { background: #2563EB; color: #fff; box-shadow: 0 2px 8px rgba(37,99,235,0.25); }
    .el-filter:active { transform: scale(0.95); }
    .el-grid { display: flex; flex-direction: column; gap: 12px; }
    .el-grid > app-environment-card { animation: elCardIn 0.3s ease both; opacity: 0; }
    @keyframes elCardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .el-empty { display: flex; flex-direction: column; align-items: center; padding: 40px 16px; }
    .el-empty-icon { width: 56px; height: 56px; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; color: #94A3B8; margin-bottom: 12px; }
    .el-empty-text { font-size: 14px; font-weight: 500; color: #94A3B8; margin: 0; }
  `]
})
export class EnvironmentListComponent implements OnInit {
  environments: Environment[] = [];
  filteredEnvs: Environment[] = [];
  filter: 'todos' | 'activos' | 'mantenimiento' = 'todos';
  searchTerm = '';

  constructor(public authService: AuthService, private envService: EnvironmentService) {}

  ngOnInit(): void { this.loadEnvironments(); }

  loadEnvironments(): void {
    this.envService.findAll().subscribe(data => {
      this.environments = data;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (this.filter === 'activos') this.filteredEnvs = this.environments.filter(e => e.estado === 'ACTIVO');
    else if (this.filter === 'mantenimiento') this.filteredEnvs = this.environments.filter(e => e.estado === 'MANTENIMIENTO');
    else this.filteredEnvs = [...this.environments];
  }

  onSearch(term: string): void {
    if (!term) { this.applyFilter(); return; }
    const t = term.toLowerCase();
    this.filteredEnvs = this.environments.filter(e => e.nombre.toLowerCase().includes(t) || e.descripcion?.toLowerCase().includes(t));
  }

  toggleStatus(env: Environment): void {
    const newStatus = env.estado === 'ACTIVO' ? 'MANTENIMIENTO' : 'ACTIVO';
    this.envService.updateStatus(env.id!, newStatus).subscribe(() => this.loadEnvironments());
  }
}