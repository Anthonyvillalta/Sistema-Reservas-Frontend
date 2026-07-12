import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>Reservas</h1>
        <a routerLink="/reservas/nueva" class="btn-primary btn-sm">+ Nueva</a>
      </div>

      <!-- Filtros -->
      <div class="filters card">
        <select [(ngModel)]="filtroEstado" (change)="loadReservas()" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="RESERVADO">Reservado</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div class="card">
        <div *ngIf="loading" class="loading-container">Cargando...</div>

        <div *ngIf="!loading && reservas.length === 0" class="empty-state">
          No hay reservas registradas
        </div>

        <div *ngFor="let r of reservas" class="reservation-card">
          <div class="res-head">
            <span class="res-code">{{ r.codigoReserva }}</span>
            <span class="badge badge-{{ r.estado?.toLowerCase() }}">{{ r.estado }}</span>
          </div>
          <div class="res-body">
            <div class="res-detail">
              <span class="res-label">Cliente</span>
              <span class="res-value">{{ r.clienteNombre }}</span>
            </div>
            <div class="res-detail">
              <span class="res-label">Ambiente</span>
              <span class="res-value">{{ r.ambienteNombre }}</span>
            </div>
            <div class="res-detail">
              <span class="res-label">Fecha</span>
              <span class="res-value">{{ r.fechaEvento | date:'dd/MM/yyyy':'':'es-PE' }}</span>
            </div>
            <div class="res-detail">
              <span class="res-label">Total</span>
              <span class="res-value res-price">S/ {{ r.precioTotal.toFixed(2) }}</span>
            </div>
          </div>
          <div class="res-footer">
            <span class="badge badge-{{ r.estadoPago?.toLowerCase() }}">{{ r.estadoPago }}</span>
            <a [routerLink]="['/reservas', r.id]" class="btn-outline">Ver detalle</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters { margin-bottom: 16px; }
    .filter-select {
      padding: 8px 12px;
      border: 2px solid var(--border);
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.9rem;
      outline: none;
    }
    .reservation-card {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .reservation-card:last-child { border-bottom: none; }
    .res-head { display: flex; justify-content: space-between; align-items: center; }
    .res-code { font-weight: 700; color: var(--primary); font-size: 0.9rem; }
    .res-body { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .res-detail { display: flex; flex-direction: column; gap: 2px; }
    .res-label { font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; }
    .res-value { font-weight: 500; font-size: 0.9rem; }
    .res-price { color: var(--primary); font-weight: 700; }
    .res-footer { display: flex; justify-content: space-between; align-items: center; }
    .btn-outline {
      padding: 6px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.8rem;
      text-decoration: none;
      color: var(--text-primary);
    }
    .btn-sm { padding: 8px 20px; font-size: 0.85rem; text-decoration: none; }
    .empty-state { text-align: center; padding: 48px; color: var(--text-light); }
  `],
})
export class ReservationListComponent implements OnInit {
  reservas: Reservation[] = [];
  loading = false;
  filtroEstado = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.loading = true;
    this.reservationService.findAll({ estado: this.filtroEstado || undefined }).subscribe({
      next: (data) => {
        this.reservas = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
