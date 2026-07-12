import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation.service';
import { PaymentService } from '../../core/services/payment.service';
import { NotificationService } from '../../core/services/notification.service';
import { Reservation } from '../../models/reservation.model';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>Reserva {{ reserva?.codigoReserva }}</h1>
        <div class="header-actions">
          <button (click)="cancelReserva()" class="btn-danger btn-sm" *ngIf="reserva?.estado !== 'CANCELADO' && reserva?.estado !== 'FINALIZADO'">
            Cancelar
          </button>
        </div>
      </div>

      <div class="grid-2">
        <!-- Detalle de la reserva -->
        <div class="card detail-card" *ngIf="reserva">
          <h3>Información de la Reserva</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Código</span>
              <span class="detail-value">{{ reserva.codigoReserva }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado</span>
              <span class="badge badge-{{ reserva.estado?.toLowerCase() }}">{{ reserva.estado }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cliente</span>
              <span class="detail-value">{{ reserva.clienteNombre }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Contacto</span>
              <span class="detail-value">{{ reserva.clienteCelular }}<br/>{{ reserva.clienteEmail }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ambiente</span>
              <span class="detail-value">{{ reserva.ambienteNombre }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fecha</span>
              <span class="detail-value">{{ reserva.fechaEvento | date:'fullDate':'':'es-PE' }}</span>
            </div>
            <div class="detail-item" *ngIf="reserva.horaInicio">
              <span class="detail-label">Horario</span>
              <span class="detail-value">{{ reserva.horaInicio }} - {{ reserva.horaFin }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Precio Total</span>
              <span class="detail-value price">S/ {{ reserva.precioTotal.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Pagado</span>
              <span class="detail-value">S/ {{ (reserva.totalPagado || 0).toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Saldo</span>
              <span class="detail-value">S/ {{ (reserva.saldoPendiente || 0).toFixed(2) }}</span>
            </div>
          </div>
          <div class="detail-notes" *ngIf="reserva.notas">
            <span class="detail-label">Notas</span>
            <p>{{ reserva.notas }}</p>
          </div>
        </div>

        <!-- Pagos y acciones -->
        <div>
          <!-- Registrar pago -->
          <div class="card detail-card">
            <h3>Registrar Pago</h3>
            <div class="payment-form">
              <div class="form-group">
                <label>Monto (S/)</label>
                <input type="number" [(ngModel)]="pagoMonto" class="form-input" placeholder="0.00" />
              </div>
              <div class="form-group">
                <label>Tipo</label>
                <select [(ngModel)]="pagoTipo" class="form-input">
                  <option value="ADELANTO">Adelanto</option>
                  <option value="SALDO">Saldo</option>
                  <option value="COMPLETO">Completo</option>
                </select>
              </div>
              <div class="form-group">
                <label>Método</label>
                <select [(ngModel)]="pagoMetodo" class="form-input">
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="YAPE">Yape</option>
                  <option value="TARJETA">Tarjeta</option>
                </select>
              </div>
              <button (click)="registrarPago()" class="btn-primary btn-sm">Registrar Pago</button>
            </div>
          </div>

          <!-- Notificaciones -->
          <div class="card detail-card">
            <h3>Notificaciones</h3>
            <div class="notif-actions">
              <button (click)="sendEmail()" class="btn-outline">📧 Enviar Email</button>
              <button (click)="sendWhatsApp()" class="btn-outline">📱 Enviar WhatsApp</button>
            </div>
          </div>

          <!-- Historial de pagos -->
          <div class="card detail-card" *ngIf="pagos.length > 0">
            <h3>Historial de Pagos</h3>
            <div *ngFor="let p of pagos" class="payment-row">
              <div class="payment-info">
                <span class="payment-type">{{ p.tipoPago }}</span>
                <span class="payment-method">{{ p.metodoPago }}</span>
                <span class="payment-date">{{ p.fechaPago | date:'short':'':'es-PE' }}</span>
              </div>
              <span class="payment-amount">S/ {{ p.monto.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-card { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
    .detail-card h3 { font-size: 1rem; font-weight: 600; color: var(--text-primary); }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .detail-item { display: flex; flex-direction: column; gap: 2px; }
    .detail-label { font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; }
    .detail-value { font-weight: 500; font-size: 0.9rem; }
    .detail-value.price { font-weight: 700; color: var(--primary); font-size: 1.1rem; }
    .detail-notes { padding-top: 12px; border-top: 1px solid var(--border); }
    .detail-notes p { margin-top: 4px; font-size: 0.9rem; color: var(--text-secondary); }
    .header-actions { display: flex; gap: 8px; }
    .btn-sm { padding: 8px 20px; font-size: 0.85rem; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; }
    .btn-danger { background: var(--warn); color: white; }
    .btn-primary { background: var(--primary); color: white; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px; }
    .form-input {
      width: 100%;
      padding: 8px 12px;
      border: 2px solid var(--border);
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
    }
    .form-input:focus { border-color: var(--primary); }
    .payment-form { display: flex; flex-direction: column; gap: 12px; }
    .notif-actions { display: flex; gap: 8px; }
    .btn-outline {
      padding: 8px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
    }
    .payment-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
    }
    .payment-row:last-child { border-bottom: none; }
    .payment-info { display: flex; flex-direction: column; gap: 2px; }
    .payment-type { font-weight: 600; font-size: 0.85rem; }
    .payment-method { font-size: 0.75rem; color: var(--text-secondary); }
    .payment-date { font-size: 0.7rem; color: var(--text-light); }
    .payment-amount { font-weight: 700; color: var(--accent); }
  `],
})
export class ReservationDetailComponent implements OnInit {
  reserva?: Reservation;
  pagos: Payment[] = [];
  pagoMonto = 0;
  pagoTipo = 'ADELANTO';
  pagoMetodo = 'EFECTIVO';

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadReserva(id);
    this.loadPagos(id);
  }

  loadReserva(id: number): void {
    this.reservationService.findById(id).subscribe((data) => (this.reserva = data));
  }

  loadPagos(id: number): void {
    this.paymentService.findByReservation(id).subscribe((data) => (this.pagos = data));
  }

  registrarPago(): void {
    if (!this.pagoMonto || this.pagoMonto <= 0) {
      alert('Ingrese un monto válido');
      return;
    }

    this.paymentService
      .create({
        reservationId: this.reserva!.id!,
        monto: this.pagoMonto,
        tipoPago: this.pagoTipo as any,
        metodoPago: this.pagoMetodo as any,
      })
      .subscribe({
        next: () => {
          this.loadReserva(this.reserva!.id!);
          this.loadPagos(this.reserva!.id!);
          this.pagoMonto = 0;
        },
        error: (err) => alert(err.error?.mensaje || 'Error al registrar pago'),
      });
  }

  cancelReserva(): void {
    if (confirm('¿Cancelar esta reserva?')) {
      this.reservationService.cancel(this.reserva!.id!).subscribe(() => {
        this.loadReserva(this.reserva!.id!);
      });
    }
  }

  sendEmail(): void {
    this.notificationService.sendEmail(this.reserva!.id!).subscribe();
  }

  sendWhatsApp(): void {
    this.notificationService.sendWhatsApp(this.reserva!.id!).subscribe();
  }
}
