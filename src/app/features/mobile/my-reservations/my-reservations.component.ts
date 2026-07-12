import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-reservations">
      <div class="tabs">
        <button class="tab" [class.tab--active]="activeTab === 'upcoming'" (click)="activeTab = 'upcoming'">Próximas</button>
        <button class="tab" [class.tab--active]="activeTab === 'history'" (click)="activeTab = 'history'">Historial</button>
        <button class="tab" [class.tab--active]="activeTab === 'cancelled'" (click)="activeTab = 'cancelled'">Canceladas</button>
      </div>

      <div class="reservations-list">
        <div *ngFor="let r of filteredReservas" class="reservation-card" (click)="verDetalle(r)">
          <div class="res-card-header">
            <span class="res-code">{{ r.codigoReserva }}</span>
            <span class="badge badge-{{ r.estado?.toLowerCase() }}">{{ r.estado }}</span>
          </div>
          <div class="res-card-body">
            <div class="res-row"><span class="res-label">Ambiente</span><span class="res-value">{{ r.ambienteNombre }}</span></div>
            <div class="res-row"><span class="res-label">Fecha</span><span class="res-value">{{ r.fechaEvento | date:'dd/MM/yyyy':'':'es-PE' }}</span></div>
            <div class="res-row"><span class="res-label">Total</span><span class="res-value price">S/ {{ r.precioTotal | number:'1.2-2' }}</span></div>
          </div>
          <div class="res-card-footer">
            <span class="badge badge-{{ r.estadoPago?.toLowerCase() }}">{{ r.estadoPago }}</span>
            <span class="res-view">Ver detalle →</span>
          </div>
        </div>

        <div *ngIf="filteredReservas.length === 0" class="empty">
          <span class="empty-icon">📋</span>
          <p class="empty-text">No hay reservas {{ activeTab === 'upcoming' ? 'próximas' : activeTab === 'history' ? 'en el historial' : 'canceladas' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-reservations { display: flex; flex-direction: column; gap: var(--space-4); }
    .tabs { display: flex; background: var(--color-surface); border-radius: var(--radius-md); padding: 4px; box-shadow: var(--shadow-sm); }
    .tab { flex: 1; padding: 10px; border: none; background: none; font-family: var(--font-family); font-size: var(--text-sm); font-weight: 500; color: var(--color-text-secondary); cursor: pointer; border-radius: var(--radius-sm); transition: all var(--transition-fast); }
    .tab--active { background: var(--color-primary); color: white; font-weight: 600; }
    .reservations-list { display: flex; flex-direction: column; gap: var(--space-3); }
    .reservation-card { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-4); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: var(--space-3); cursor: pointer; transition: transform var(--transition-fast); }
    .reservation-card:active { transform: scale(0.98); }
    .res-card-header { display: flex; justify-content: space-between; align-items: center; }
    .res-code { font-weight: 700; color: var(--color-primary); font-size: var(--text-sm); }
    .res-card-body { display: flex; flex-direction: column; gap: var(--space-1); }
    .res-row { display: flex; justify-content: space-between; font-size: var(--text-sm); }
    .res-label { color: var(--color-text-secondary); }
    .res-value { font-weight: 500; }
    .res-value.price { color: var(--color-primary); font-weight: 700; }
    .res-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-2); border-top: 1px solid var(--color-border); }
    .res-view { font-size: var(--text-xs); color: var(--color-primary); font-weight: 600; }
    .empty { text-align: center; padding: var(--space-10); }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: var(--space-3); }
    .empty-text { font-size: var(--text-sm); color: var(--color-text-secondary); }
  `]
})
export class MyReservationsComponent implements OnInit {
  reservas: Reservation[] = [];
  activeTab: 'upcoming' | 'history' | 'cancelled' = 'upcoming';

  get filteredReservas(): Reservation[] {
    if (this.activeTab === 'upcoming') return this.reservas.filter(r => r.estado !== 'CANCELADO' && r.estado !== 'FINALIZADO');
    if (this.activeTab === 'history') return this.reservas.filter(r => r.estado === 'FINALIZADO' || r.estado === 'EN_PROCESO');
    return this.reservas.filter(r => r.estado === 'CANCELADO');
  }

  constructor(private reservationService: ReservationService, private router: Router) {}

  ngOnInit(): void {
    this.reservationService.findAll().subscribe({ next: (data) => { this.reservas = data; } });
  }

  verDetalle(r: Reservation): void {
    if (r.id) this.router.navigate(['/reservas', r.id]);
  }
}
