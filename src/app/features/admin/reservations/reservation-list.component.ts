import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../models/reservation.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent, StatusBadgeComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <app-page-header title="Reservas">
        <a routerLink="/reservas/nueva" class="btn-primary">
          <span class="material-icons">add</span> Nueva Reserva
        </a>
      </app-page-header>

      <div class="filters">
        <button class="filter-chip" *ngFor="let f of filters" [class.filter-chip--active]="activeFilter === f.value" (click)="setFilter(f.value)">
          {{ f.label }}
        </button>
      </div>

      <!-- Vista desktop: tabla -->
      <div class="table-container" *ngIf="filteredReservas.length > 0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Ambiente</th>
              <th>Fecha</th>
              <th>Evento</th>
              <th>Horario</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of filteredReservas">
              <td><span class="code">{{ r.codigoReserva }}</span></td>
              <td><span class="client-name">{{ r.clienteNombre }}</span></td>
              <td><span class="env-name">{{ r.ambienteNombre }}</span></td>
              <td>{{ r.fechaEvento | date:'dd/MM/yyyy':'':'es-PE' }}</td>
              <td>{{ r.tipoEvento || '—' }}</td>
              <td>{{ r.horaInicio ? (r.horaInicio + ' — ' + r.horaFin) : '—' }}</td>
              <td><span class="price">S/ {{ r.precioTotal | number:'1.2-2' }}</span></td>
              <td><app-status-badge [status]="r.estado || 'RESERVADO'" type="reservation"></app-status-badge></td>
              <td><app-status-badge [status]="r.estadoPago || 'PENDIENTE'" type="payment"></app-status-badge></td>
              <td><a [routerLink]="['/reservas', r.id]" class="table-action">Ver</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vista mobile: tarjetas verticales -->
      <div class="card-list" *ngIf="filteredReservas.length > 0">
        <a class="reservation-card" *ngFor="let r of filteredReservas" [routerLink]="['/reservas', r.id]">
          <div class="card-header">
            <div class="card-code-group">
              <span class="card-code-label">TRANSACCIÓN</span>
              <span class="card-code">{{ r.codigoReserva }}</span>
            </div>
            <span class="card-status-chip" [class.chip-reservado]="r.estado === 'RESERVADO'" [class.chip-confirmado]="r.estado === 'CONFIRMADO'" [class.chip-en_proceso]="r.estado === 'EN_PROCESO'" [class.chip-finalizado]="r.estado === 'FINALIZADO'" [class.chip-cancelado]="r.estado === 'CANCELADO'">{{ statusLabel(r.estado) }}</span>
          </div>
          <div class="card-body">
            <div class="card-row-divider"></div>
            <div class="card-row">
              <span class="card-label"><span class="material-icons card-row-icon">person</span> Cliente</span>
              <span class="card-value card-value--client">{{ r.clienteNombre }}</span>
            </div>
            <div class="card-row">
              <span class="card-label"><span class="material-icons card-row-icon">meeting_room</span> Ambiente</span>
              <span class="card-value card-value--env">{{ r.ambienteNombre }}</span>
            </div>
            <div class="card-row">
              <span class="card-label"><span class="material-icons card-row-icon">calendar_today</span> Fecha</span>
              <span class="card-value card-value--date">{{ r.fechaEvento | date:'dd/MM/yyyy':'':'es-PE' }}</span>
            </div>
            <div class="card-row" *ngIf="r.tipoEvento">
              <span class="card-label"><span class="material-icons card-row-icon">celebration</span> Evento</span>
              <span class="card-value card-value--event">{{ r.tipoEvento }}</span>
            </div>
            <div class="card-row" *ngIf="r.horaInicio">
              <span class="card-label"><span class="material-icons card-row-icon">schedule</span> Horario</span>
              <span class="card-value card-value--time">{{ r.horaInicio }} — {{ r.horaFin }}</span>
            </div>
            <div class="card-row" *ngIf="r.precioSillas || r.precioMotor">
              <span class="card-label"><span class="material-icons card-row-icon">add_circle</span> Adicionales</span>
              <span class="card-value card-value--extra">{{ getAdicionalesTexto(r) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label"><span class="material-icons card-row-icon">receipt_long</span> Total</span>
              <span class="card-value card-value--total">S/ {{ r.precioTotal | number:'1.2-2' }}</span>
            </div>
            <div class="card-row" *ngIf="r.estadoPago !== 'PENDIENTE'">
              <span class="card-label"><span class="material-icons card-row-icon">trending_up</span> Prog. pago</span>
              <span class="card-value card-value--progress">{{ getPaymentPercent(r) }}%</span>
            </div>
            <div class="card-progress" *ngIf="r.totalPagado && r.totalPagado > 0">
              <div class="card-progress-track">
                <div class="card-progress-fill" [style.width.%]="getPaymentPercent(r)"></div>
              </div>
              <div class="card-progress-labels">
                <span>Pagado: S/ {{ (r.totalPagado || 0) | number:'1.2-2' }}</span>
                <span *ngIf="getSaldo(r) > 0">Restante: S/ {{ getSaldo(r) | number:'1.2-2' }}</span>
              </div>
            </div>
            <div class="card-row-divider"></div>
            <div class="card-row">
              <span class="card-label"><span class="material-icons card-row-icon">payments</span> Pago</span>
              <span class="card-value" [class.card-value--paid]="r.estadoPago === 'PAGADO'" [class.card-value--partial]="r.estadoPago === 'PARCIAL'" [class.card-value--pending]="!r.estadoPago || r.estadoPago === 'PENDIENTE'">{{ paymentLabel(r.estadoPago) }}</span>
            </div>
          </div>
        </a>
      </div>

      <app-empty-state *ngIf="filteredReservas.length === 0" icon="📅" title="Sin reservas" message="No hay reservas con ese filtro" actionLabel="Nueva Reserva" (onAction)="goToNew()"></app-empty-state>
    </div>
  `,
  styles: [`
    .btn-primary { display: inline-flex; align-items: center; gap: var(--space-2); padding: 8px 20px; background: var(--color-primary); color: white; border-radius: var(--radius-md); font-weight: 600; font-size: var(--text-sm); text-decoration: none; }
    .btn-primary .material-icons { font-size: 18px; }
    .filters { display: flex; gap: var(--space-2); margin-bottom: var(--space-4); flex-wrap: wrap; }
    .filter-chip { padding: 6px 16px; border: 1px solid var(--color-border); border-radius: var(--radius-full); background: var(--color-surface); font-family: var(--font-family); font-size: var(--text-sm); cursor: pointer; color: var(--color-text-secondary); transition: all var(--transition-fast); }
    .filter-chip--active { background: var(--color-primary); color: white; border-color: var(--color-primary); }
    @media (max-width: 768px) {
      .filters { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .filter-chip { padding: 5px 10px; font-size: 12px; text-align: center; }
    }
    .table-container { background: var(--color-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; padding: 14px 16px; font-size: var(--text-xs); font-weight: 600; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid var(--color-border); white-space: nowrap; }
    .data-table td { padding: 14px 16px; font-size: var(--text-sm); border-bottom: 1px solid var(--color-border-light); white-space: nowrap; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: var(--color-background-alt); }
    .card-list { display: none; }
    .reservation-card {
      display: block;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      padding: 16px 18px;
      margin-bottom: 12px;
      text-decoration: none;
      color: inherit;
    }
    .reservation-card:active { opacity: 0.8; }
    .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .card-code-group { display: flex; flex-direction: column; gap: 1px; }
    .card-code-label { font-size: 0.6rem; font-weight: 600; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.8px; }
    .card-code { font-weight: 600; color: var(--color-primary); font-size: 0.72rem; font-family: 'SF Mono', 'IBM Plex Mono', 'Cascadia Code', 'JetBrains Mono', monospace; letter-spacing: 0.2px; opacity: 0.85; }
    .card-body { display: flex; flex-direction: column; gap: 12px; }
    .card-row-divider { height: 1px; background: #E2E8F0; margin: 0 0 4px; }
    .card-row { display: flex; align-items: center; justify-content: space-between; }
    .card-label { font-size: 10px; font-weight: 500; color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 4px; }
    .card-row-icon { font-size: 14px; color: var(--color-text-tertiary); }
    .card-value { font-size: 13px; font-weight: 600; color: var(--color-text-primary); letter-spacing: 0.01em; font-family: 'SF Mono', 'Fira Code', 'IBM Plex Mono', monospace; padding: 2px 10px; border-radius: 6px; display: inline-block; }
    .card-price { font-size: 14px; font-weight: 700; color: var(--color-text-primary); font-variant-numeric: tabular-nums; letter-spacing: 0.01em; font-family: 'SF Mono', 'Fira Code', 'IBM Plex Mono', monospace; padding: 2px 10px; border-radius: 6px; display: inline-block; }
    .card-value--client { background: #ffffffff; color: #000000ff; }
    .card-value--env { background: #ffffffff; color: #000000ff; }
    .card-value--date { background: #ffffffff; color: #000000ff; }
    .card-value--event { background: #ffffffff; color: #000000ff; }
    .card-value--time { background: #ffffffff; color: #000000ff; }
    .card-value--extra { background: #ffffffff; color: #000000ff; font-size: 12px; white-space: nowrap; }
    .card-value--total { background: #ffffffff; color: #000000ff; font-weight: 800; }
    .card-value--progress { background: #0044ffff; color: #ffffffff; font-weight: 700; }
    .card-value--paid { background: #ECFDF5; color: #065F46; font-weight: 700; }
    .card-value--partial { background: #FEF3C7; color: #B45309; font-weight: 700; }
    .card-value--pending { background: #FEE2E2; color: #DC2626; font-weight: 700; }
    .card-status-chip { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .chip-reservado { background: #DBEAFE; color: #1D4ED8; }
    .chip-confirmado { background: #D1FAE5; color: #059669; }
    .chip-en_proceso { background: #FEF3C7; color: #D97706; }
    .chip-finalizado { background: #F1F5F9; color: #475569; }
    .chip-cancelado { background: #FEE2E2; color: #DC2626; }
    .card-progress { margin-top: -2px; padding: 0 2px; }
    .card-progress-track { height: 4px; background: #E2E8F0; border-radius: 2px; overflow: hidden; }
    .card-progress-fill { height: 100%; background: linear-gradient(90deg, #10B981, #34D399); border-radius: 2px; transition: width 0.4s ease; }
    .card-progress-labels { display: flex; justify-content: space-between; font-size: 10px; color: #000000ff; margin-top: 2px; font-family: 'SF Mono', 'Fira Code', monospace; }
    .card-progress-labels span:last-child { color: #000000ff; font-weight: 600; }
    @media (max-width: 768px) {
      .table-container { display: none; }
      .card-list { display: flex; flex-direction: column; }
      .reservation-card { margin-left: 0; margin-right: 0; }
    }
    .code { font-weight: 700; color: var(--color-primary); font-size: var(--text-sm); font-family: monospace; }
    .client-name { font-weight: 500; }
    .price { font-weight: 700; color: var(--color-text-primary); }
    .table-action { padding: 4px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--text-xs); color: var(--color-text-secondary); text-decoration: none; }
    .table-action:hover { background: var(--color-background); }
  `]
})
export class ReservationListComponent implements OnInit {
  reservas: Reservation[] = [];
  activeFilter = 'todas';
  private router = inject(Router);

  filters = [
    { label: 'Todas', value: 'todas' },
    { label: 'Reservado', value: 'RESERVADO' },
    { label: 'Confirmado', value: 'CONFIRMADO' },
    { label: 'En Proceso', value: 'EN_PROCESO' },
    { label: 'Finalizado', value: 'FINALIZADO' },
    { label: 'Cancelado', value: 'CANCELADO' },
  ];

  get filteredReservas(): Reservation[] {
    if (this.activeFilter === 'todas') return this.reservas;
    return this.reservas.filter(r => r.estado === this.activeFilter);
  }

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void { this.reservationService.findAll().subscribe(data => this.reservas = data); }

  getAdicionalesTexto(r: Reservation): string {
    const partes: string[] = [];
    if (r.precioSillas) partes.push('Sillas ' + r.precioSillas.toFixed(2));
    if (r.precioMotor) partes.push('Motor ' + r.precioMotor.toFixed(2));
    return partes.join(' + ');
  }

  statusLabel(estado?: string): string {
    const labels: Record<string, string> = { RESERVADO: 'Reservado', CONFIRMADO: 'Confirmado', EN_PROCESO: 'En Proceso', FINALIZADO: 'Finalizado', CANCELADO: 'Cancelado' };
    return labels[estado || ''] || 'Reservado';
  }

  paymentLabel(estado?: string): string {
    const labels: Record<string, string> = { PENDIENTE: 'Pendiente', PARCIAL: 'Parcial', PAGADO: 'Pagado' };
    return labels[estado || ''] || 'Pendiente';
  }

  getPaymentPercent(r: Reservation): number {
    const total = r.precioTotal || 0;
    const paid = r.totalPagado || 0;
    if (total === 0) return 0;
    return Math.min(100, Math.round((paid / total) * 100));
  }

  getSaldo(r: Reservation): number {
    return (r.precioTotal || 0) - (r.totalPagado || 0);
  }

  setFilter(value: string): void { this.activeFilter = value; }

  goToNew(): void { this.router.navigate(['/reservas/nueva']); }
}
