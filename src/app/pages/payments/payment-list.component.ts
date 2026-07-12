import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Payment } from '../../models/payment.model';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>Pagos</h1>
      </div>

      <div class="filters card">
        <select [(ngModel)]="filterEstado" (change)="loadReservas()" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="PARCIAL">Parciales</option>
          <option value="PAGADO">Pagados</option>
        </select>
      </div>

      <div class="card">
        <div *ngFor="let r of reservas" class="payment-row-card">
          <div class="payment-head">
            <span class="res-code">{{ r.codigoReserva }}</span>
            <span class="badge badge-{{ r.estado?.toLowerCase() }}">{{ r.estado }}</span>
          </div>
          <div class="payment-details">
            <span>Cliente: <strong>{{ r.clienteNombre }}</strong></span>
            <span>Ambiente: {{ r.ambienteNombre }}</span>
            <span>Total: <strong>S/ {{ r.precioTotal.toFixed(2) }}</strong></span>
            <span>Pagado: <strong style="color: var(--accent);">S/ {{ (r.totalPagado || 0).toFixed(2) }}</strong></span>
            <span>Saldo: <strong style="color: var(--warn);">S/ {{ (r.saldoPendiente || 0).toFixed(2) }}</strong></span>
          </div>
          <div class="payment-status">
            <span class="badge badge-{{ r.estadoPago?.toLowerCase() }}">{{ r.estadoPago }}</span>
            <a [routerLink]="['/reservas', r.id]" class="btn-outline">Pagar</a>
          </div>
        </div>
        <div *ngIf="reservas.length === 0" class="empty-state">No hay reservas con pagos</div>
      </div>
    </div>
  `,
  styles: [`
    .filters { margin-bottom: 16px; }
    .filter-select { padding: 8px 12px; border: 2px solid var(--border); border-radius: 8px; font-family: inherit; font-size: 0.9rem; outline: none; }
    .payment-row-card { padding: 16px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
    .payment-row-card:last-child { border-bottom: none; }
    .payment-head { display: flex; justify-content: space-between; align-items: center; }
    .res-code { font-weight: 700; color: var(--primary); }
    .payment-details { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; }
    .payment-status { display: flex; justify-content: space-between; align-items: center; }
    .btn-outline { padding: 6px 14px; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: pointer; font-family: inherit; font-size: 0.8rem; text-decoration: none; color: var(--text-primary); }
    .empty-state { text-align: center; padding: 48px; color: var(--text-light); }
  `],
})
export class PaymentListComponent implements OnInit {
  reservas: Reservation[] = [];
  filterEstado = '';

  constructor(
    private reservationService: ReservationService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.reservationService.findAll({ estado: this.filterEstado || undefined }).subscribe({
      next: (data) => {
        this.reservas = data;
      },
    });
  }
}
