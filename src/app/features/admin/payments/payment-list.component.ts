import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="pl">
      <div class="pl-header">
        <div>
          <h1 class="pl-title">Pagos</h1>
          <p class="pl-subtitle">Controla ingresos, saldos y pagos pendientes</p>
        </div>
      </div>

      <div class="pl-summary">
        <div class="pl-summary-card">
          <span class="pl-summary-label">Total pendiente</span>
          <strong class="pl-summary-value pl-summary-value--danger">S/ {{ totalPendiente | number:'1.2-2' }}</strong>
          <span class="pl-summary-count">{{ reservasPendientes }} reservas</span>
        </div>
        <div class="pl-summary-card">
          <span class="pl-summary-label">Total cobrado</span>
          <strong class="pl-summary-value pl-summary-value--success">S/ {{ totalCobrado | number:'1.2-2' }}</strong>
          <span class="pl-summary-count">{{ reservasPagadas }} completadas</span>
        </div>
      </div>

      <!-- Pendientes -->
      <div class="pl-section">
        <div class="pl-section-head" (click)="toggleSection('pend')">
          <div class="pl-section-icon pl-section-icon--warn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h2 class="pl-section-title">Pendientes</h2>
            <span class="pl-section-sub">Pagos por cobrar</span>
          </div>
          <span class="pl-section-count">{{ pendientes.length }}</span>
          <svg class="pl-section-arrow" [class.open]="secOpen['pend']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="pl-section-body" [class.open]="secOpen['pend']">
          <div class="pl-card-list">
            <div *ngFor="let r of pendientes" class="pl-card" (click)="verReserva(r)">
              <div class="pl-card-top">
                <span class="pl-card-code">{{ r.codigoReserva }}</span>
                <span class="pl-badge pl-badge--warn">Pendiente</span>
              </div>
              <div class="pl-card-body">
                <div class="pl-card-row">
                  <span class="pl-card-label">Cliente</span>
                  <strong class="pl-card-value">{{ r.clienteNombre }}</strong>
                </div>
                <div class="pl-card-row">
                  <span class="pl-card-label">Ambiente</span>
                  <span class="pl-card-value">{{ r.ambienteNombre }}</span>
                </div>
              </div>
              <div class="pl-card-divider"></div>
              <div class="pl-card-footer">
                <div>
                  <span class="pl-card-label">Total reserva</span>
                  <strong class="pl-card-amount">S/ {{ r.precioTotal | number:'1.2-2' }}</strong>
                </div>
                <a [routerLink]="['/reservas', r.id]" class="pl-card-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              </div>
            </div>
            <div class="pl-empty" *ngIf="pendientes.length === 0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 16 12 12 8 16"/></svg>
              <span>Sin pendientes</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Parciales -->
      <div class="pl-section">
        <div class="pl-section-head" (click)="toggleSection('parc')">
          <div class="pl-section-icon pl-section-icon--blue">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div>
            <h2 class="pl-section-title">Parciales</h2>
            <span class="pl-section-sub">Pagos incompletos</span>
          </div>
          <span class="pl-section-count">{{ parciales.length }}</span>
          <svg class="pl-section-arrow" [class.open]="secOpen['parc']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="pl-section-body" [class.open]="secOpen['parc']">
          <div class="pl-card-list">
            <div *ngFor="let r of parciales" class="pl-card" (click)="verReserva(r)">
              <div class="pl-card-top">
                <span class="pl-card-code">{{ r.codigoReserva }}</span>
                <span class="pl-badge pl-badge--blue">Saldo pendiente</span>
              </div>
              <div class="pl-card-body">
                <div class="pl-card-row">
                  <span class="pl-card-label">Cliente</span>
                  <strong class="pl-card-value">{{ r.clienteNombre }}</strong>
                </div>
                <div class="pl-card-row">
                  <span class="pl-card-label">Ambiente</span>
                  <span class="pl-card-value">{{ r.ambienteNombre }}</span>
                </div>
              </div>
              <div class="pl-card-divider"></div>
              <div class="pl-card-footer">
                <div class="pl-card-progress" *ngIf="r.totalPagado">
                  <div class="pl-card-progress-track">
                    <div class="pl-card-progress-fill" [style.width.%]="getPaymentPercent(r)"></div>
                  </div>
                  <div class="pl-card-progress-labels">
                    <span>Pagado S/ {{ (r.totalPagado || 0) | number:'1.2-2' }}</span>
                    <span>Restan S/ {{ (r.saldoPendiente || 0) | number:'1.2-2' }}</span>
                  </div>
                </div>
                <a [routerLink]="['/reservas', r.id]" class="pl-card-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              </div>
              <div class="pl-card-hist">
                <div class="pl-card-hist-toggle" (click)="$event.stopPropagation(); togglePagos(r.id!)">
                  <span>Historial de pagos ({{ r.pagos?.length || 0 }})</span>
                  <svg class="pl-card-hist-arrow" [class.open]="pagosAbiertos[r.id!]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="pl-card-hist-body" [class.open]="pagosAbiertos[r.id!]" *ngIf="r.pagos && r.pagos.length > 0">
                  <div class="pl-card-hist-item" *ngFor="let p of r.pagos">
                    <span class="pl-card-hist-method">{{ p.metodoPago }}</span>
                    <span class="pl-card-hist-type">{{ p.tipoPago }}</span>
                    <span class="pl-card-hist-date">{{ p.fechaPago | date:'dd/MM HH:mm':'':'es-PE' }}</span>
                    <span class="pl-card-hist-monto">+ S/ {{ p.monto | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pl-empty" *ngIf="parciales.length === 0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 16 12 12 8 16"/></svg>
              <span>Sin parciales</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagados con filtro mes -->
      <div class="pl-section">
        <div class="pl-section-head" (click)="toggleSection('pag')">
          <div class="pl-section-icon pl-section-icon--green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <h2 class="pl-section-title">Pagados</h2>
            <span class="pl-section-sub">Pagos completados</span>
          </div>
          <span class="pl-section-count">{{ pagados.length }}</span>
          <svg class="pl-section-arrow" [class.open]="secOpen['pag']" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="pl-section-body" [class.open]="secOpen['pag']">
          <div class="pl-month-filter" *ngIf="meses.length > 0">
            <select [(ngModel)]="mesActual" (change)="onMesChange()" class="pl-month-select">
              <option *ngFor="let m of meses" [value]="m.val">{{ m.label }}</option>
            </select>
          </div>
          <div class="pl-card-list">
            <div *ngFor="let r of pagadosFiltro" class="pl-card" (click)="verReserva(r)">
              <div class="pl-card-top">
                <span class="pl-card-code">{{ r.codigoReserva }}</span>
                <span class="pl-badge pl-badge--green">Pagado</span>
              </div>
              <div class="pl-card-body">
                <div class="pl-card-row">
                  <span class="pl-card-label">Cliente</span>
                  <strong class="pl-card-value">{{ r.clienteNombre }}</strong>
                </div>
                <div class="pl-card-row">
                  <span class="pl-card-label">Ambiente</span>
                  <span class="pl-card-value">{{ r.ambienteNombre }}</span>
                </div>
              </div>
              <div class="pl-card-divider"></div>
              <div class="pl-card-footer">
                <div>
                  <span class="pl-card-label">Total pagado</span>
                  <strong class="pl-card-amount pl-card-amount--paid">S/ {{ r.precioTotal | number:'1.2-2' }}</strong>
                </div>
                <a [routerLink]="['/reservas', r.id]" class="pl-card-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              </div>
              <div class="pl-card-hist">
                <div class="pl-card-hist-toggle" (click)="$event.stopPropagation(); togglePagos(r.id!)">
                  <span>Historial de pagos ({{ r.pagos?.length || 0 }})</span>
                  <svg class="pl-card-hist-arrow" [class.open]="pagosAbiertos[r.id!]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <div class="pl-card-hist-body" [class.open]="pagosAbiertos[r.id!]" *ngIf="r.pagos && r.pagos.length > 0">
                  <div class="pl-card-hist-item" *ngFor="let p of r.pagos">
                    <span class="pl-card-hist-method">{{ p.metodoPago }}</span>
                    <span class="pl-card-hist-type">{{ p.tipoPago }}</span>
                    <span class="pl-card-hist-date">{{ p.fechaPago | date:'dd/MM HH:mm':'':'es-PE' }}</span>
                    <span class="pl-card-hist-monto">+ S/ {{ p.monto | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="pl-empty" *ngIf="pagadosFiltro.length === 0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 16 12 12 8 16"/></svg>
              <span>Sin pagados en este mes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pl { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; animation: plFade 0.3s ease both; }
    @keyframes plFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .pl-title { font-size: 22px; font-weight: 700; color: #1E293B; margin: 0; line-height: 1.2; }
    .pl-subtitle { font-size: 13px; color: #94A3B8; margin: 2px 0 0; }
    .pl-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .pl-summary-card { background: #fff; border-radius: 16px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 2px; }
    .pl-summary-label { font-size: 10px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }
    .pl-summary-value { font-size: 20px; font-weight: 800; font-variant-numeric: tabular-nums; font-family: 'SF Mono','Fira Code','IBM Plex Mono',monospace; letter-spacing: -0.02em; }
    .pl-summary-value--danger { color: #DC2626; }
    .pl-summary-value--success { color: #059669; }
    .pl-summary-count { font-size: 11px; font-weight: 500; color: #94A3B8; }
    .pl-section { background: #fff; border-radius: 18px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04); }
    .pl-section-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; cursor: pointer; }
    .pl-section-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .pl-section-icon--warn { background: #FEF3C7; color: #D97706; }
    .pl-section-icon--blue { background: #DBEAFE; color: #2563EB; }
    .pl-section-icon--green { background: #D1FAE5; color: #059669; }
    .pl-section-title { font-size: 15px; font-weight: 700; color: #1E293B; margin: 0; }
    .pl-section-sub { font-size: 11px; color: #94A3B8; display: block; margin-top: 1px; }
    .pl-section-count { margin-left: auto; width: 28px; height: 28px; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #64748B; flex-shrink: 0; }
    .pl-section-arrow { color: #94A3B8; transition: transform 0.2s; flex-shrink: 0; }
    .pl-section-arrow.open { transform: rotate(180deg); }
    .pl-section-body { display: none; }
    .pl-section-body.open { display: block; }
    .pl-card-list { display: flex; flex-direction: column; gap: 8px; }
    .pl-card { background: #F8FAFC; border-radius: 14px; padding: 14px; cursor: pointer; transition: all 0.12s; }
    .pl-card:active { transform: scale(0.98); background: #F1F5F9; }
    .pl-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .pl-card-code { font-size: 11px; font-weight: 700; color: #2563EB; font-family: 'SF Mono','Fira Code',monospace; letter-spacing: 0.3px; }
    .pl-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
    .pl-badge--warn { background: #FEF3C7; color: #D97706; }
    .pl-badge--blue { background: #DBEAFE; color: #2563EB; }
    .pl-badge--green { background: #D1FAE5; color: #059669; }
    .pl-card-body { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .pl-card-row { display: flex; justify-content: space-between; align-items: center; }
    .pl-card-label { font-size: 11px; font-weight: 500; color: #94A3B8; }
    .pl-card-value { font-size: 13px; font-weight: 600; color: #1E293B; font-family: 'SF Mono','Fira Code','IBM Plex Mono',monospace; }
    .pl-card-divider { height: 1px; background: #E2E8F0; margin-bottom: 10px; }
    .pl-card-footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .pl-card-footer > div { display: flex; flex-direction: column; gap: 3px; }
    .pl-card-amount { font-size: 17px; font-weight: 800; color: #1E293B; font-variant-numeric: tabular-nums; font-family: 'SF Mono','Fira Code','IBM Plex Mono',monospace; letter-spacing: -0.02em; }
    .pl-card-amount--paid { color: #059669; }
    .pl-card-action { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #94A3B8; transition: all 0.12s; flex-shrink: 0; }
    .pl-card-progress { width: 100%; }
    .pl-card-progress-track { height: 3px; background: #E2E8F0; border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
    .pl-card-progress-fill { height: 100%; background: linear-gradient(90deg,#2563EB,#3B82F6); border-radius: 2px; transition: width 0.4s ease; }
    .pl-card-progress-labels { display: flex; justify-content: space-between; font-size: 10px; font-weight: 500; color: #94A3B8; font-family: 'SF Mono','Fira Code',monospace; }
    .pl-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px; color: #94A3B8; font-size: 13px; font-weight: 500; }
    .pl-month-filter { margin-bottom: 10px; }
    .pl-month-select { width: 100%; height: 40px; padding: 0 14px; border: 2px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; font-family: inherit; background: #F8FAFC; color: #1E293B; outline: none; -webkit-appearance: none; appearance: none; cursor: pointer; }

    /* Historial toggle */
    .pl-card-hist { margin-top: 6px; }
    .pl-card-hist-toggle { display: flex; align-items: center; gap: 6px; padding: 6px 0; cursor: pointer; font-size: 11px; font-weight: 600; color: #94A3B8; }
    .pl-card-hist-arrow { transition: transform 0.2s; flex-shrink: 0; }
    .pl-card-hist-arrow.open { transform: rotate(180deg); }
    .pl-card-hist-body { display: none; }
    .pl-card-hist-body.open { display: block; }
    .pl-card-hist-item { display: flex; align-items: center; gap: 6px; padding: 4px 0; font-size: 10px; font-weight: 500; color: #64748B; }
    .pl-card-hist-method { background: #F1F5F9; padding: 1px 6px; border-radius: 5px; font-weight: 600; font-size: 9px; color: #475569; flex-shrink: 0; }
    .pl-card-hist-type { font-weight: 600; color: #475569; flex-shrink: 0; font-size: 10px; }
    .pl-card-hist-date { margin-left: auto; color: #94A3B8; font-size: 10px; }
    .pl-card-hist-monto { font-weight: 700; color: #059669; font-family: 'SF Mono','Fira Code',monospace; font-variant-numeric: tabular-nums; font-size: 10px; }
  `]
})
export class PaymentListComponent implements OnInit {
  reservas: Reservation[] = [];
  pagosAbiertos: Record<number, boolean> = {};
  secOpen: Record<string, boolean> = { pend: true, parc: true, pag: false };
  mesActual = 'todas';
  private router = inject(Router);

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void { this.reservationService.findAll().subscribe(data => { this.reservas = data; this.armarMeses(); }); }

  get pendientes(): Reservation[] { return this.reservas.filter(r => r.estadoPago === 'PENDIENTE'); }
  get parciales(): Reservation[] { return this.reservas.filter(r => r.estadoPago === 'PARCIAL'); }
  get pagados(): Reservation[] { return this.reservas.filter(r => r.estadoPago === 'PAGADO'); }
  get reservasPendientes(): number { return this.pendientes.length; }
  get reservasPagadas(): number { return this.pagados.length; }

  get totalPendiente(): number { return this.pendientes.reduce((s, r) => s + (r.saldoPendiente || r.precioTotal), 0); }
  get totalCobrado(): number { return this.pagados.reduce((s, r) => s + r.precioTotal, 0); }

  getPaymentPercent(r: Reservation): number {
    const total = r.precioTotal || 0;
    const paid = r.totalPagado || 0;
    if (total === 0) return 0;
    return Math.min(100, Math.round((paid / total) * 100));
  }

  meses: { val: string; label: string }[] = [];

  armarMeses(): void {
    const set = new Set<string>();
    this.pagados.forEach(r => {
      if (r.createdAt) {
        const m = r.createdAt.substring(0, 7);
        set.add(m);
      }
    });
    this.meses = Array.from(set).sort().reverse().map(m => {
      const [y, mo] = m.split('-');
      const names = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
      return { val: m, label: `${names[parseInt(mo)-1]} ${y}` };
    });
    this.meses.unshift({ val: 'todas', label: 'Todos los meses' });
    this.mesActual = 'todas';
  }

  get pagadosFiltro(): Reservation[] {
    if (this.mesActual === 'todas') return this.pagados;
    return this.pagados.filter(r => r.createdAt?.startsWith(this.mesActual));
  }

  onMesChange(): void {}

  toggleSection(key: string): void { this.secOpen[key] = !this.secOpen[key]; }
  togglePagos(id: number): void { this.pagosAbiertos[id] = !this.pagosAbiertos[id]; }
  verReserva(r: Reservation): void { this.router.navigate(['/reservas', r.id]); }
}