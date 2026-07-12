import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ReservationService } from '../../core/services/reservation.service';
import { PaymentService } from '../../core/services/payment.service';
import { EnvironmentService } from '../../core/services/environment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard fade-in">
      <div class="page-header">
        <h1>Dashboard</h1>
        <span class="date-today">{{ today | date:'fullDate':'':'es-PE' }}</span>
      </div>

      <!-- Tarjetas de resumen -->
      <div class="grid-3 stats-grid">
        <div class="stat-card card">
          <div class="stat-icon" style="background: #e3f2fd; color: #1565c0;">event</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.reservasHoy }}</span>
            <span class="stat-label">Reservas hoy</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon" style="background: #e8f5e9; color: #2e7d32;">payments</div>
          <div class="stat-info">
            <span class="stat-value">S/ {{ stats.ingresosMes.toFixed(2) }}</span>
            <span class="stat-label">Ingresos del mes</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon" style="background: #fff3e0; color: #e65100;">location_city</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.ambientesActivos }}</span>
            <span class="stat-label">Ambientes activos</span>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="section">
        <h2 class="section-title">Acciones rápidas</h2>
        <div class="grid-3">
          <a routerLink="/reservas/nueva" class="action-card card">
            <span class="action-icon">➕</span>
            <span class="action-text">Nueva Reserva</span>
          </a>
          <a routerLink="/clientes/nuevo" class="action-card card">
            <span class="action-icon">👤</span>
            <span class="action-text">Nuevo Cliente</span>
          </a>
          <a routerLink="/calendario" class="action-card card">
            <span class="action-icon">📅</span>
            <span class="action-text">Ver Calendario</span>
          </a>
        </div>
      </div>

      <!-- Próximas reservas -->
      <div class="section">
        <h2 class="section-title">Próximas reservas</h2>
        <div class="card">
          <div *ngIf="proximasReservas.length === 0" class="empty-state">
            No hay reservas próximas
          </div>
          <div *ngFor="let r of proximasReservas" class="reservation-row">
            <div class="reservation-info">
              <span class="reservation-code">{{ r.codigoReserva }}</span>
              <span class="reservation-client">{{ r.clienteNombre }}</span>
              <span class="reservation-env">{{ r.ambienteNombre }}</span>
            </div>
            <div class="reservation-meta">
              <span class="reservation-date">{{ r.fechaEvento | date:'shortDate':'':'es-PE' }}</span>
              <span class="badge badge-{{ r.estado?.toLowerCase() }}">{{ r.estado }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
    }

    .date-today {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .stats-grid {
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Material Icons';
      font-size: 1.5rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--text-primary);
      cursor: pointer;
      transition: transform 0.2s;
    }

    .action-card:hover {
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-weight: 500;
    }

    .reservation-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }

    .reservation-row:last-child {
      border-bottom: none;
    }

    .reservation-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .reservation-code {
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--primary);
    }

    .reservation-client {
      font-size: 0.9rem;
    }

    .reservation-env {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .reservation-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .reservation-date {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: var(--text-light);
    }

    @media (max-width: 768px) {
      .stat-value {
        font-size: 1.25rem;
      }
    }
  `],
})
export class DashboardComponent implements OnInit {
  today = new Date();

  stats = {
    reservasHoy: 0,
    ingresosMes: 0,
    ambientesActivos: 0,
  };

  proximasReservas: any[] = [];

  constructor(
    private reservationService: ReservationService,
    private paymentService: PaymentService,
    private environmentService: EnvironmentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadProximasReservas();
  }

  private loadStats(): void {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    const finMes = new Date(inicioMes.getFullYear(), inicioMes.getMonth() + 1, 0);

    this.reservationService.findAll({
      fechaInicio: inicioMes.toISOString(),
      fechaFin: finMes.toISOString(),
    }).subscribe((reservas) => {
      this.stats.ingresosMes = reservas.reduce((sum, r) => sum + (r.precioTotal || 0), 0);
    });

    this.environmentService.findAll(undefined, 'ACTIVO').subscribe((envs) => {
      this.stats.ambientesActivos = envs.length;
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    this.reservationService.findAll({
      fechaInicio: hoy.toISOString(),
      fechaFin: manana.toISOString(),
    }).subscribe((reservas) => {
      this.stats.reservasHoy = reservas.length;
    });
  }

  private loadProximasReservas(): void {
    const hoy = new Date();
    const enUnMes = new Date();
    enUnMes.setDate(enUnMes.getDate() + 30);

    this.reservationService.findAll({
      fechaInicio: hoy.toISOString(),
      fechaFin: enUnMes.toISOString(),
    }).subscribe((reservas) => {
      this.proximasReservas = reservas
        .filter((r) => r.estado !== 'CANCELADO' && r.estado !== 'FINALIZADO')
        .slice(0, 10);
    });
  }
}
