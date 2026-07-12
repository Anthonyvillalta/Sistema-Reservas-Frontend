import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Reservation } from '../../../models/reservation.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="res-card" (click)="onClick.emit()">
      <div class="res-header">
        <span class="res-code">{{ reservation.codigoReserva }}</span>
        <app-status-badge [status]="reservation.estado || 'RESERVADO'" type="reservation"></app-status-badge>
      </div>
      <div class="res-body">
        <div class="res-row"><span class="res-label">Cliente</span><span class="res-value">{{ reservation.clienteNombre }}</span></div>
        <div class="res-row"><span class="res-label">Ambiente</span><span class="res-value">{{ reservation.ambienteNombre }}</span></div>
        <div class="res-row"><span class="res-label">Fecha</span><span class="res-value">{{ reservation.fechaEvento | date:'dd/MM/yyyy':'':'es-PE' }}</span></div>
        <div class="res-row"><span class="res-label">Total</span><span class="res-value price">S/ {{ reservation.precioTotal | number:'1.2-2' }}</span></div>
      </div>
      <div class="res-footer">
        <app-status-badge [status]="reservation.estadoPago || 'PENDIENTE'" type="payment"></app-status-badge>
        <span class="res-view" *ngIf="showView">Ver detalle →</span>
      </div>
    </div>
  `,
  styles: [`
    .res-card {
      background: var(--color-surface); border-radius: var(--radius-lg);
      padding: var(--space-4); box-shadow: var(--shadow-sm); cursor: pointer;
      display: flex; flex-direction: column; gap: var(--space-3);
      transition: transform var(--transition-fast);
    }
    .res-card:active { transform: scale(0.98); }
    .res-header { display: flex; justify-content: space-between; align-items: center; }
    .res-code { font-weight: 700; color: var(--color-primary); font-size: var(--text-sm); }
    .res-body { display: flex; flex-direction: column; gap: var(--space-1); }
    .res-row { display: flex; justify-content: space-between; font-size: var(--text-sm); }
    .res-label { color: var(--color-text-secondary); }
    .res-value { font-weight: 500; }
    .res-value.price { color: var(--color-primary); font-weight: 700; }
    .res-footer { display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-2); border-top: 1px solid var(--color-border); }
    .res-view { font-size: var(--text-xs); color: var(--color-primary); font-weight: 600; }
  `]
})
export class ReservationCardComponent {
  @Input() reservation!: Reservation;
  @Input() showView = true;
  @Output() onClick = new EventEmitter<void>();
}
