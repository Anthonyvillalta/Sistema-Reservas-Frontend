import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UpcomingReservation } from '../../../features/admin/dashboard/dashboard.models';

@Component({
  selector: 'app-reservation-list-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="reservation-item" [routerLink]="['/reservas', reservation.id]">
      <div class="reservation-item-image">
        <img [src]="reservation.imagenUrl || 'https://images.unsplash.com/photo-1576013551627-0cc20b84c2b6?w=100&h=100&fit=crop'" alt="Ambiente" loading="lazy">
      </div>
      <div class="reservation-item-info">
        <h4 class="reservation-item-name">{{ reservation.ambienteNombre }}</h4>
        <div class="reservation-item-meta">
          <span class="reservation-item-date">
            <span class="material-icons">calendar_today</span>
            {{ reservation.fecha }}
          </span>
          <span class="reservation-item-time">
            <span class="material-icons">schedule</span>
            {{ reservation.horaInicio }} - {{ reservation.horaFin }}
          </span>
        </div>
        <span class="reservation-item-badge" [class]="'status-' + (reservation.estado | lowercase)">
          {{ reservation.estado }}
        </span>
      </div>
      <span class="material-icons reservation-item-arrow">chevron_right</span>
    </a>
  `,
  styles: [`
    .reservation-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 14px;
      background: #FFFFFF;
      border-radius: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
      text-decoration: none;
      color: #0F172A;
      transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 150ms ease, background 150ms ease;
      width: 100%;
      box-sizing: border-box;
      min-width: 0;
      border: 1px solid rgba(0,0,0,0.02);
      -webkit-tap-highlight-color: transparent;
    }
    .reservation-item:active {
      transform: scale(0.985);
      background: #F8FAFC;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .reservation-item-image {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      overflow: hidden;
      flex-shrink: 0;
      background: #F1F5F9;
    }
    .reservation-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .reservation-item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .reservation-item-name {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #0F172A;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .reservation-item-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .reservation-item-date,
    .reservation-item-time {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #475569;
    }
    .reservation-item-date .material-icons,
    .reservation-item-time .material-icons {
      font-size: 13px;
      color: #94A3B8;
    }
    .reservation-item-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      width: fit-content;
    }
    .status-confirmado {
      background: #D1FAE5;
      color: #10B981;
    }
    .status-pendiente {
      background: #FEF3C7;
      color: #F59E0B;
    }
    .status-reservado {
      background: #DBEAFE;
      color: #7C3AED;
    }
    .status-cancelado {
      background: #FEE2E2;
      color: #EF4444;
    }
    .status-finalizado {
      background: #F1F5F9;
      color: #64748B;
    }
    .reservation-item-arrow {
      color: #94A3B8;
      font-size: 20px;
      flex-shrink: 0;
    }
  `]
})
export class ReservationListItemComponent {
  @Input() reservation!: UpcomingReservation;
}
