import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { EnvironmentService } from '../../core/services/environment.service';
import { AuthService } from '../../core/services/auth.service';
import { Maintenance } from '../../models/maintenance.model';
import { Environment } from '../../models/environment.model';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mt">

      <!-- Header -->
      <div class="mt-header">
        <div>
          <h1 class="mt-title">Mantenimiento</h1>
          <p class="mt-subtitle">Programa y controla los mantenimientos de los ambientes</p>
        </div>
      </div>

      <!-- Form -->
      <div class="mt-card" *ngIf="authService.isAdmin()">
        <div class="mt-card-head">
          <div class="mt-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div>
            <h2 class="mt-card-title">Programar Mantenimiento</h2>
            <span class="mt-card-sub">Registra una nueva intervención programada</span>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="mt-field">
            <label class="mt-label">Ambiente *</label>
            <div class="mt-env-grid">
              <button *ngFor="let e of environments" class="mt-env-chip" [class.mt-env-chip--active]="model.environmentId === e.id" (click)="model.environmentId = e.id!" type="button">
                <svg class="mt-env-chip-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span class="mt-env-chip-name">{{ e.nombre }}</span>
                <span *ngIf="model.environmentId === e.id" class="mt-env-chip-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
              </button>
            </div>
          </div>

          <div class="mt-field-row">
            <div class="mt-field mt-field--half">
              <label class="mt-label">Fecha inicio *</label>
              <div class="mt-input-wrap">
                <svg class="mt-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="datetime-local" [(ngModel)]="model.fechaInicio" name="fechaInicio" required class="mt-input" />
              </div>
            </div>
            <div class="mt-field mt-field--half">
              <label class="mt-label">Fecha fin *</label>
              <div class="mt-input-wrap">
                <svg class="mt-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="datetime-local" [(ngModel)]="model.fechaFin" name="fechaFin" required class="mt-input" />
              </div>
            </div>
          </div>

          <div class="mt-field">
            <label class="mt-label">Motivo *</label>
            <div class="mt-input-wrap">
              <svg class="mt-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <input type="text" [(ngModel)]="model.motivo" name="motivo" required class="mt-input" placeholder="Ej: Reparación de piscina" autocomplete="off" />
            </div>
          </div>

          <button type="submit" class="mt-btn" [disabled]="!form.valid">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            Programar
          </button>
        </form>
      </div>

      <!-- List -->
      <div class="mt-card mt-card--list">
        <div class="mt-card-head">
          <div class="mt-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h2 class="mt-card-title">Mantenimientos Programados</h2>
            <span class="mt-card-sub">{{ maintenances.length }} {{ maintenances.length === 1 ? 'registro' : 'registros' }}</span>
          </div>
        </div>

        <div class="mt-list">
          <div *ngFor="let m of maintenances; let i = index" class="mt-item" [style.animation-delay]="0.04 * i + 's'">
            <div class="mt-item-top">
              <div class="mt-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div class="mt-item-info">
                <strong class="mt-item-name">{{ m.ambienteNombre }}</strong>
                <span class="mt-item-reason">{{ m.motivo }}</span>
              </div>
              <span class="mt-badge" [class.mt-badge--prog]="m.estado === 'PROGRAMADO'" [class.mt-badge--maint]="m.estado === 'MANTENIMIENTO'" [class.mt-badge--done]="m.estado === 'FINALIZADO'" [class.mt-badge--cancel]="m.estado === 'CANCELADO'">
                {{ statusLabel(m.estado) }}
              </span>
            </div>
            <div class="mt-item-dates">
              <span class="mt-item-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ m.fechaInicio | date:"dd MMM HH:mm":"":"es-PE" }}
              </span>
              <span class="mt-item-sep">→</span>
              <span class="mt-item-date">
                {{ m.fechaFin | date:"dd MMM HH:mm":"":"es-PE" }}
              </span>
            </div>
            <div class="mt-item-meta" *ngIf="m.creadoPor">
              <span>Por: {{ m.creadoPor }}</span>
            </div>
            <div class="mt-item-actions" *ngIf="authService.isAdmin()">
              <button class="mt-action mt-action--danger" (click)="deleteMaint(m)" *ngIf="m.estado !== 'CANCELADO' && m.estado !== 'FINALIZADO'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Cancelar
              </button>
            </div>
          </div>
          <div class="mt-empty" *ngIf="maintenances.length === 0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 16 12 12 8 16"/></svg>
            <span>No hay mantenimientos programados</span>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div class="mt-toast" *ngIf="toastMsg">
        <span>{{ toastMsg }}</span>
      </div>
    </div>
  `,
  styles: [`
    .mt { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; animation: mtFade 0.3s ease both; }
    @keyframes mtFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .mt-title { font-size: 22px; font-weight: 700; color: #1E293B; margin: 0; line-height: 1.2; }
    .mt-subtitle { font-size: 13px; color: #94A3B8; margin: 2px 0 0; }
    .mt-card { background: #fff; border-radius: 18px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04); }
    .mt-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .mt-card-icon { width: 40px; height: 40px; border-radius: 12px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; color: #64748B; flex-shrink: 0; }
    .mt-card-title { font-size: 16px; font-weight: 700; color: #1E293B; margin: 0; }
    .mt-card-sub { font-size: 12px; color: #94A3B8; display: block; margin-top: 1px; }

    .mt-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    .mt-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .mt-field--half { margin-bottom: 14px; }
    .mt-label { font-size: 12px; font-weight: 600; color: #475569; }
    .mt-input-wrap { position: relative; display: flex; align-items: center; }
    .mt-input-icon { position: absolute; left: 14px; color: #94A3B8; pointer-events: none; z-index: 1; }
    .mt-input {
      width: 100%; height: 48px; padding: 0 16px 0 42px;
      border: 2px solid #E2E8F0; border-radius: 12px;
      font-size: 14px; font-weight: 500; font-family: inherit;
      background: #F8FAFC; color: #1E293B; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .mt-input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); background: #fff; }
    .mt-input::placeholder { color: #94A3B8; font-weight: 400; }
    .mt-select { -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }

    /* Ambiente chips */
    .mt-env-grid { display: flex; flex-direction: column; gap: 6px; }
    .mt-env-chip {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 12px 14px;
      border: 2px solid #E2E8F0; border-radius: 12px;
      background: #F8FAFC; cursor: pointer; text-align: left; font-family: inherit;
      transition: all 0.12s;
    }
    .mt-env-chip:active { transform: scale(0.98); }
    .mt-env-chip--active {
      border-color: #2563EB; background: rgba(37,99,235,0.05);
    }
    .mt-env-chip-icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: #DBEAFE; color: #2563EB;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; padding: 6px;
    }
    .mt-env-chip-name { flex: 1; font-size: 14px; font-weight: 600; color: #1E293B; }
    .mt-env-chip-check {
      width: 20px; height: 20px; border-radius: 50%;
      background: #2563EB; color: #fff;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .mt { padding-left: 0; padding-right: 0; gap: 12px; }
      .mt-title { font-size: 20px; }
      .mt-card { padding: 14px; border-radius: 14px; }
      .mt-field-row { grid-template-columns: 1fr; gap: 0; }
      .mt-field--half { margin-bottom: 14px; }
      .mt-item { padding: 12px; }
      .mt-item-top { flex-wrap: wrap; gap: 6px; }
      .mt-item-name { font-size: 13px; }
      .mt-item-reason { font-size: 11px; }
      .mt-badge { font-size: 9px; padding: 2px 8px; }
      .mt-item-date { font-size: 11px; }
      .mt-empty { padding: 16px; font-size: 12px; }
      .mt-item-dates { flex-wrap: wrap; }
      .mt-card-head { gap: 10px; }
      .mt-card-icon { width: 36px; height: 36px; }
      .mt-card-icon svg { width: 18px; height: 18px; }
      .mt-card-title { font-size: 15px; }
      .mt-card-sub { font-size: 11px; }
    }
    @media (max-width: 360px) {
      .mt-item-top { flex-direction: column; align-items: stretch; }
      .mt-badge { align-self: flex-start; }
    }

    .mt-btn {
      width: 100%; height: 48px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: #2563EB; color: #fff;
      border: none; border-radius: 12px;
      font-size: 15px; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.15s;
      box-shadow: 0 4px 12px rgba(37,99,235,0.25);
    }
    .mt-btn:active { transform: scale(0.97); }
    .mt-btn:disabled { opacity: 0.4; transform: none; box-shadow: none; }

    /* List */
    .mt-card--list { margin-bottom: 0; }
    .mt-list { display: flex; flex-direction: column; gap: 8px; }
    .mt-item {
      background: #F8FAFC; border-radius: 14px; padding: 14px;
      animation: mtItemIn 0.3s ease both; opacity: 0;
    }
    @keyframes mtItemIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .mt-item-top { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
    .mt-item-icon { width: 32px; height: 32px; border-radius: 8px; background: #DBEAFE; display: flex; align-items: center; justify-content: center; color: #2563EB; flex-shrink: 0; }
    .mt-item-info { flex: 1; min-width: 0; }
    .mt-item-name { font-size: 14px; font-weight: 700; color: #1E293B; display: block; }
    .mt-item-reason { font-size: 12px; color: #64748B; display: block; margin-top: 1px; }
    .mt-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; flex-shrink: 0; white-space: nowrap; }
    .mt-badge--prog { background: #DBEAFE; color: #1D4ED8; }
    .mt-badge--maint { background: #FEF3C7; color: #D97706; }
    .mt-badge--done { background: #D1FAE5; color: #059669; }
    .mt-badge--cancel { background: #FEE2E2; color: #DC2626; }

    .mt-item-dates { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
    .mt-item-date { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #475569; }
    .mt-item-date svg { color: #94A3B8; flex-shrink: 0; }
    .mt-item-sep { color: #CBD5E1; font-size: 12px; font-weight: 600; }
    .mt-item-meta { font-size: 11px; color: #94A3B8; margin-bottom: 8px; }
    .mt-item-actions { display: flex; gap: 8px; }
    .mt-action {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 6px 12px; border: none; border-radius: 8px;
      font-size: 11px; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.1s;
    }
    .mt-action:active { transform: scale(0.95); }
    .mt-action--danger { background: #FEE2E2; color: #DC2626; }

    .mt-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px; color: #94A3B8; font-size: 13px; font-weight: 500; }

    /* Toast */
    .mt-toast {
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      z-index: 999; padding: 12px 20px;
      background: #DC2626; color: #fff; border-radius: 12px;
      font-size: 14px; font-weight: 600;
      box-shadow: 0 4px 16px rgba(220,38,38,0.3);
      animation: mtToastIn 0.2s ease both; max-width: 90%; text-align: center;
    }
    @keyframes mtToastIn { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  `]
})
export class MaintenanceComponent implements OnInit {
  environments: Environment[] = [];
  maintenances: Maintenance[] = [];
  toastMsg = '';

  model: Maintenance = {
    environmentId: 0,
    fechaInicio: '',
    fechaFin: '',
    motivo: '',
  };

  constructor(
    public maintenanceService: MaintenanceService,
    public environmentService: EnvironmentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void { this.loadData(); }

  loadData(): void {
    this.environmentService.findAll().subscribe((data) => (this.environments = data));
    this.maintenanceService.findAll().subscribe((data) => (this.maintenances = data));
  }

  statusLabel(estado?: string): string {
    const labels: Record<string, string> = { PROGRAMADO: 'Programado', MANTENIMIENTO: 'En curso', FINALIZADO: 'Finalizado', CANCELADO: 'Cancelado' };
    return labels[estado || ''] || estado || '—';
  }

  onSubmit(): void {
    this.maintenanceService.create(this.model).subscribe({
      next: () => {
        this.loadData();
        this.model = { environmentId: 0, fechaInicio: '', fechaFin: '', motivo: '' };
      },
      error: (err) => {
        this.toastMsg = err.error?.mensaje || 'Error al programar mantenimiento';
        setTimeout(() => this.toastMsg = '', 3500);
      },
    });
  }

  deleteMaint(m: Maintenance): void {
    if (m.estado === 'CANCELADO' || m.estado === 'FINALIZADO') return;
    this.maintenanceService.delete(m.id!).subscribe({
      next: () => this.loadData(),
      error: () => {
        this.toastMsg = 'Error al cancelar mantenimiento';
        setTimeout(() => this.toastMsg = '', 3500);
      },
    });
  }
}