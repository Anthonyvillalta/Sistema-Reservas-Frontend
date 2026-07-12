import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, Report } from '../../core/services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rp">

      <!-- Header -->
      <div class="rp-header">
        <div>
          <h1 class="rp-title">Dashboard de Reportes</h1>
          <p class="rp-subtitle">Resumen general del rendimiento del centro recreacional</p>
        </div>
      </div>

      <!-- KPIs -->
      <div class="rp-kpis" *ngIf="ingresosData">
        <div class="rp-kpi">
          <div class="rp-kpi-icon rp-kpi-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="rp-kpi-body">
            <span class="rp-kpi-label">Ingresos Totales</span>
            <strong class="rp-kpi-value">S/ {{ ingresosData.ingresosTotales?.toFixed(2) }}</strong>
          </div>
        </div>
        <div class="rp-kpi">
          <div class="rp-kpi-icon rp-kpi-icon--green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="rp-kpi-body">
            <span class="rp-kpi-label">Reservas</span>
            <strong class="rp-kpi-value">{{ ingresosData.totalReservas }}</strong>
          </div>
        </div>
        <div class="rp-kpi" *ngIf="ingresosData.promedioPorReserva">
          <div class="rp-kpi-icon rp-kpi-icon--purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div class="rp-kpi-body">
            <span class="rp-kpi-label">Promedio x Reserva</span>
            <strong class="rp-kpi-value">S/ {{ ingresosData.promedioPorReserva?.toFixed(2) }}</strong>
          </div>
        </div>
        <div class="rp-kpi" *ngIf="pagosData">
          <div class="rp-kpi-icon rp-kpi-icon--orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div class="rp-kpi-body">
            <span class="rp-kpi-label">Total Pagos</span>
            <strong class="rp-kpi-value">{{ pagosData.total }}</strong>
          </div>
        </div>
      </div>

      <!-- Ingresos -->
      <div class="rp-card">
        <div class="rp-card-head">
          <div class="rp-card-icon rp-card-icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h2 class="rp-card-title">Consultar Ingresos</h2>
            <span class="rp-card-sub">Filtra por mes y año</span>
          </div>
        </div>
        <div class="rp-filters">
          <div class="rp-field">
            <label class="rp-label">Año</label>
            <input type="number" [(ngModel)]="ingresosAnio" class="rp-input" />
          </div>
          <div class="rp-field">
            <label class="rp-label">Mes</label>
            <select [(ngModel)]="ingresosMes" class="rp-input rp-select">
              <option *ngFor="let m of meses; let i = index" [value]="i + 1">{{ m }}</option>
            </select>
          </div>
          <button class="rp-btn" (click)="loadIngresos()">Consultar</button>
        </div>
      </div>

      <!-- Ocupación -->
      <div class="rp-card">
        <div class="rp-card-head">
          <div class="rp-card-icon rp-card-icon--green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <h2 class="rp-card-title">Ocupación de Ambientes</h2>
            <span class="rp-card-sub">Selecciona un rango de fechas</span>
          </div>
        </div>
        <div class="rp-filters">
          <div class="rp-field">
            <label class="rp-label">Fecha inicio</label>
            <div class="rp-input-wrap">
              <svg class="rp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input type="date" [(ngModel)]="ocupacionInicio" class="rp-input rp-input--icon" />
            </div>
          </div>
          <div class="rp-field">
            <label class="rp-label">Fecha fin</label>
            <div class="rp-input-wrap">
              <svg class="rp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input type="date" [(ngModel)]="ocupacionFin" class="rp-input rp-input--icon" />
            </div>
          </div>
          <button class="rp-btn" (click)="loadOcupacion()">Consultar</button>
        </div>
        <div class="rp-result" *ngIf="ocupacionData">
          <div class="rp-stat">
            <span class="rp-stat-label">Reservas en el período</span>
            <strong class="rp-stat-value">{{ ocupacionData.totalReservas }}</strong>
          </div>
          <div class="rp-stat">
            <span class="rp-stat-label">Ambientes utilizados</span>
            <strong class="rp-stat-value">{{ ocupacionData.totalAmbientes }}</strong>
          </div>
        </div>
      </div>

      <!-- Clientes Frecuentes -->
      <div class="rp-card">
        <div class="rp-card-head">
          <div class="rp-card-icon rp-card-icon--orange">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <h2 class="rp-card-title">Clientes Frecuentes</h2>
            <span class="rp-card-sub">Top 10 clientes con más reservas</span>
          </div>
          <button class="rp-btn rp-btn--sm" (click)="loadClientesFrecuentes()">Cargar</button>
        </div>
        <div class="rp-ranking" *ngIf="clientesData?.clientes?.length > 0">
          <div *ngFor="let c of clientesData.clientes; let i = index" class="rp-ranking-item">
            <span class="rp-ranking-pos">{{ i + 1 }}</span>
            <div class="rp-ranking-avatar">{{ c.nombre?.charAt(0) || '?' }}</div>
            <span class="rp-ranking-name">{{ c.nombre }}</span>
            <span class="rp-ranking-count">{{ c.totalReservas }} {{ c.totalReservas === 1 ? 'reserva' : 'reservas' }}</span>
          </div>
        </div>
        <div class="rp-empty" *ngIf="clientesData && clientesData.clientes?.length === 0">
          <span>Sin datos de clientes</span>
        </div>
      </div>

      <!-- Pagos -->
      <div class="rp-card">
        <div class="rp-card-head">
          <div class="rp-card-icon rp-card-icon--purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div>
            <h2 class="rp-card-title">Estado de Pagos</h2>
            <span class="rp-card-sub">Parciales vs Completos por rango</span>
          </div>
        </div>
        <div class="rp-filters">
          <div class="rp-field">
            <label class="rp-label">Fecha inicio</label>
            <div class="rp-input-wrap">
              <svg class="rp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input type="date" [(ngModel)]="pagosInicio" class="rp-input rp-input--icon" />
            </div>
          </div>
          <div class="rp-field">
            <label class="rp-label">Fecha fin</label>
            <div class="rp-input-wrap">
              <svg class="rp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input type="date" [(ngModel)]="pagosFin" class="rp-input rp-input--icon" />
            </div>
          </div>
          <button class="rp-btn" (click)="loadPagos()">Consultar</button>
        </div>
        <div class="rp-result" *ngIf="pagosData">
          <div class="rp-pay-bar">
            <div class="rp-pay-segment rp-pay-segment--partial" [style.width.%]="getParcialPercent()">
              <span *ngIf="getParcialPercent() > 10">{{ getParcialPercent() }}%</span>
            </div>
            <div class="rp-pay-segment rp-pay-segment--full" [style.width.%]="getCompletoPercent()">
              <span *ngIf="getCompletoPercent() > 10">{{ getCompletoPercent() }}%</span>
            </div>
          </div>
          <div class="rp-pay-legend">
            <span><span class="rp-pay-dot rp-pay-dot--partial"></span> Parciales: {{ pagosData.pagosParciales }}</span>
            <span><span class="rp-pay-dot rp-pay-dot--full"></span> Completos: {{ pagosData.pagosCompletos }}</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .rp { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; animation: rpFade 0.3s ease both; }
    @keyframes rpFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .rp-title { font-size: 22px; font-weight: 700; color: #1E293B; margin: 0; line-height: 1.2; }
    .rp-subtitle { font-size: 13px; color: #94A3B8; margin: 2px 0 0; }

    /* KPIs */
    .rp-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .rp-kpi { background: #fff; border-radius: 16px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04); display: flex; align-items: center; gap: 12px; animation: rpKpiIn 0.35s ease both; opacity: 0; }
    .rp-kpi:nth-child(1) { animation-delay: 0.05s; }
    .rp-kpi:nth-child(2) { animation-delay: 0.1s; }
    .rp-kpi:nth-child(3) { animation-delay: 0.15s; }
    .rp-kpi:nth-child(4) { animation-delay: 0.2s; }
    @keyframes rpKpiIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .rp-kpi-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .rp-kpi-icon--blue { background: #DBEAFE; color: #2563EB; }
    .rp-kpi-icon--green { background: #D1FAE5; color: #059669; }
    .rp-kpi-icon--purple { background: #F3E8FF; color: #7C3AED; }
    .rp-kpi-icon--orange { background: #FEF3C7; color: #D97706; }
    .rp-kpi-body { display: flex; flex-direction: column; gap: 1px; }
    .rp-kpi-label { font-size: 10px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }
    .rp-kpi-value { font-size: 18px; font-weight: 800; color: #1E293B; font-variant-numeric: tabular-nums; }

    /* Card */
    .rp-card { background: #fff; border-radius: 18px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04); }
    .rp-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .rp-card-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .rp-card-icon--blue { background: #DBEAFE; color: #2563EB; }
    .rp-card-icon--green { background: #D1FAE5; color: #059669; }
    .rp-card-icon--orange { background: #FEF3C7; color: #D97706; }
    .rp-card-icon--purple { background: #F3E8FF; color: #7C3AED; }
    .rp-card-title { font-size: 15px; font-weight: 700; color: #1E293B; margin: 0; }
    .rp-card-sub { font-size: 11px; color: #94A3B8; display: block; margin-top: 1px; flex: 1; }

    /* Filters */
    .rp-filters { display: flex; flex-direction: column; gap: 10px; }
    .rp-field { display: flex; flex-direction: column; gap: 4px; }
    .rp-label { font-size: 12px; font-weight: 600; color: #475569; }
    .rp-input-wrap { position: relative; display: flex; align-items: center; }
    .rp-input-icon { position: absolute; left: 12px; color: #94A3B8; pointer-events: none; z-index: 1; }
    .rp-input {
      width: 100%; height: 44px; padding: 0 14px;
      border: 2px solid #E2E8F0; border-radius: 12px;
      font-size: 14px; font-weight: 500; font-family: inherit;
      background: #F8FAFC; color: #1E293B; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .rp-input--icon { padding-left: 38px; }
    .rp-input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); background: #fff; }
    .rp-select { -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; cursor: pointer; }
    .rp-btn {
      height: 44px; padding: 0 20px;
      background: #2563EB; color: #fff;
      border: none; border-radius: 12px;
      font-size: 14px; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.12s;
    }
    .rp-btn:active { transform: scale(0.97); }
    .rp-btn--sm { height: 34px; padding: 0 14px; font-size: 12px; flex-shrink: 0; margin-left: auto; }

    /* Result */
    .rp-result { display: flex; gap: 12px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #E2E8F0; }
    .rp-stat { flex: 1; }
    .rp-stat-label { font-size: 11px; font-weight: 500; color: #94A3B8; display: block; }
    .rp-stat-value { font-size: 20px; font-weight: 800; color: #1E293B; font-variant-numeric: tabular-nums; }

    /* Ranking */
    .rp-ranking { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
    .rp-ranking-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: #F8FAFC; border-radius: 10px; }
    .rp-ranking-pos { width: 24px; font-size: 12px; font-weight: 700; color: #94A3B8; text-align: center; }
    .rp-ranking-avatar { width: 30px; height: 30px; border-radius: 50%; background: #2563EB; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .rp-ranking-name { flex: 1; font-size: 13px; font-weight: 600; color: #1E293B; }
    .rp-ranking-count { font-size: 11px; font-weight: 600; color: #94A3B8; }

    /* Payment bar */
    .rp-pay-bar { display: flex; height: 28px; border-radius: 14px; overflow: hidden; margin-bottom: 8px; }
    .rp-pay-segment { display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; transition: width 0.4s ease; }
    .rp-pay-segment--partial { background: #F59E0B; }
    .rp-pay-segment--full { background: #10B981; }
    .rp-pay-legend { display: flex; gap: 16px; font-size: 12px; font-weight: 500; color: #475569; }
    .rp-pay-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }
    .rp-pay-dot--partial { background: #F59E0B; }
    .rp-pay-dot--full { background: #10B981; }

    .rp-empty { text-align: center; padding: 16px; color: #94A3B8; font-size: 13px; }

    @media (max-width: 480px) {
      .rp-kpis { gap: 8px; }
      .rp-card { padding: 14px; }
      .rp-kpi-value { font-size: 16px; }
    }
  `]
})
export class ReportsComponent {
  readonly meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];

  ingresosAnio = new Date().getFullYear();
  ingresosMes = new Date().getMonth() + 1;
  ingresosData: any = null;

  ocupacionInicio = '';
  ocupacionFin = '';
  ocupacionData: any = null;

  clientesData: any = null;

  pagosInicio = '';
  pagosFin = '';
  pagosData: any = null;

  constructor(private reportService: ReportService) {}

  loadIngresos(): void {
    this.reportService.ingresosMensuales(this.ingresosAnio, this.ingresosMes).subscribe((r) => {
      this.ingresosData = r.datos;
    });
  }

  loadOcupacion(): void {
    if (!this.ocupacionInicio || !this.ocupacionFin) return;
    this.reportService.ocupacion(this.ocupacionInicio, this.ocupacionFin).subscribe((r) => {
      this.ocupacionData = r.datos;
    });
  }

  loadClientesFrecuentes(): void {
    this.reportService.clientesFrecuentes(10).subscribe((r) => {
      this.clientesData = r.datos;
    });
  }

  loadPagos(): void {
    if (!this.pagosInicio || !this.pagosFin) return;
    this.reportService.pagosParcialesVsCompletos(this.pagosInicio, this.pagosFin).subscribe((r) => {
      this.pagosData = r.datos;
    });
  }

  getParcialPercent(): number {
    if (!this.pagosData?.total || this.pagosData.total === 0) return 0;
    return Math.round((this.pagosData.pagosParciales / this.pagosData.total) * 100);
  }

  getCompletoPercent(): number {
    if (!this.pagosData?.total || this.pagosData.total === 0) return 0;
    return Math.round((this.pagosData.pagosCompletos / this.pagosData.total) * 100);
  }
}
