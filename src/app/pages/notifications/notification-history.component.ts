import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="nt">

      <!-- Header -->
      <div class="nt-header">
        <div>
          <h1 class="nt-title">Notificaciones</h1>
          <p class="nt-subtitle">Gestiona los avisos enviados a clientes por WhatsApp y correo electrónico</p>
        </div>
      </div>

      <!-- Selector -->
      <div class="nt-card">
        <div class="nt-card-head">
          <div class="nt-card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h2 class="nt-card-title">Seleccionar Reserva</h2>
            <span class="nt-card-sub">Busca la reserva para enviar notificaciones</span>
          </div>
        </div>
        <div class="nt-field">
          <div class="nt-select-wrap">
            <svg class="nt-select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <select [(ngModel)]="selectedReservaId" (change)="onSelectChange()" class="nt-select">
              <option [value]="0">Seleccionar reserva...</option>
              <option *ngFor="let r of reservas" [value]="r.id" class="nt-opt">{{ r.codigoReserva }} — {{ r.clienteNombre }}</option>
            </select>
          </div>
        </div>
        <div class="nt-resume" *ngIf="selectedReserva">
          <div class="nt-resume-item">
            <span class="nt-resume-label">Cliente</span>
            <strong class="nt-resume-value">{{ selectedReserva.clienteNombre }}</strong>
          </div>
          <div class="nt-resume-item">
            <span class="nt-resume-label">Ambiente</span>
            <span class="nt-resume-value">{{ selectedReserva.ambienteNombre }}</span>
          </div>
          <div class="nt-resume-item">
            <span class="nt-resume-label">Total</span>
            <span class="nt-resume-value nt-resume-value--mono">S/ {{ selectedReserva.precioTotal | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="nt-card" *ngIf="selectedReservaId">
        <div class="nt-card-head">
          <div class="nt-card-icon nt-card-icon--orange">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
          </div>
          <div>
            <h2 class="nt-card-title">Enviar Notificación</h2>
            <span class="nt-card-sub">Elige el canal de comunicación</span>
          </div>
        </div>
        <div class="nt-actions">
          <button class="nt-action nt-action--email" (click)="sendEmail()" [disabled]="sending">
            <span class="nt-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </span>
            <span class="nt-action-body">
              <span class="nt-action-title">Correo Electrónico</span>
              <span class="nt-action-desc">Notificar al cliente</span>
            </span>
            <span class="nt-action-spin" *ngIf="sending">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            </span>
          </button>
          <button class="nt-action nt-action--whatsapp" (click)="sendWhatsApp()" [disabled]="sending">
            <span class="nt-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </span>
            <span class="nt-action-body">
              <span class="nt-action-title">WhatsApp</span>
              <span class="nt-action-desc">Notificar al cliente</span>
            </span>
            <span class="nt-action-spin" *ngIf="sending">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            </span>
          </button>
        </div>
      </div>

      <!-- Historial -->
      <div class="nt-card" *ngIf="notificaciones.length > 0">
        <div class="nt-card-head">
          <div class="nt-card-icon nt-card-icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h2 class="nt-card-title">Historial de Notificaciones</h2>
            <span class="nt-card-sub">{{ notificaciones.length }} {{ notificaciones.length === 1 ? 'envío' : 'envíos' }}</span>
          </div>
        </div>
        <div class="nt-timeline">
          <div *ngFor="let n of notificaciones; let i = index" class="nt-item" [style.animation-delay]="0.04 * i + 's'">
            <div class="nt-item-bar" [class.nt-item-bar--ok]="n.estadoEnvio === 'ENVIADO'" [class.nt-item-bar--fail]="n.estadoEnvio === 'FALLIDO'"></div>
            <div class="nt-item-body">
              <div class="nt-item-top">
                <span class="nt-item-type">{{ n.tipo === 'EMAIL' ? '📧 Correo' : '💬 WhatsApp' }}</span>
                <span class="nt-badge" [class.nt-badge--ok]="n.estadoEnvio === 'ENVIADO'" [class.nt-badge--fail]="n.estadoEnvio === 'FALLIDO'">
                  {{ n.estadoEnvio === 'ENVIADO' ? 'Enviado' : 'Fallido' }}
                </span>
              </div>
              <div class="nt-item-meta">
                <span class="nt-item-to">Para: {{ n.destinatario }}</span>
                <span class="nt-item-date">{{ n.fechaEnvio | date:"dd MMM yyyy HH:mm":"":"es-PE" }}</span>
              </div>
              <div class="nt-item-msg">
                <p class="nt-msg-preview">{{ truncate(n.mensaje, 50) }}</p>
                <button class="nt-item-msg-btn" (click)="$event.stopPropagation(); openMsgModal(n)" *ngIf="(n.mensaje?.length ?? 0) > 50">
                  Ver detalle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div class="nt-empty" *ngIf="!selectedReservaId">
        <div class="nt-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        <p class="nt-empty-text">Selecciona una reserva para ver sus notificaciones</p>
      </div>
      <div class="nt-empty" *ngIf="selectedReservaId && notificaciones.length === 0">
        <div class="nt-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 16 12 12 8 16"/></svg>
        </div>
        <p class="nt-empty-text">Sin notificaciones aún. Usa los botones de arriba para enviar.</p>
      </div>
    </div>

    <!-- Modal mensaje completo -->
    <div class="nt-modal-overlay" *ngIf="modalMsg" (click)="modalMsg = null">
      <div class="nt-modal" (click)="$event.stopPropagation()">
        <div class="nt-modal-top">
          <span class="nt-modal-type">{{ modalMsg.tipo === 'EMAIL' ? '📧 Correo' : '💬 WhatsApp' }}</span>
          <button class="nt-modal-close" (click)="modalMsg = null">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="nt-modal-meta">
          <span>Para: {{ modalMsg.destinatario }}</span>
          <span>{{ modalMsg.fechaEnvio | date:"dd MMM yyyy HH:mm":"":"es-PE" }}</span>
        </div>
        <div class="nt-modal-body">{{ modalMsg.mensaje }}</div>
      </div>
    </div>
  `,
  styles: [`
    .nt { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding: 0 0 24px; animation: ntFade 0.3s ease both; box-sizing: border-box; width: 100%; max-width: 100%; overflow-x: hidden; }
    .nt-title { font-size: 22px; font-weight: 700; color: #1E293B; margin: 0; line-height: 1.2; }
    .nt-subtitle { font-size: 13px; color: #94A3B8; margin: 2px 0 0; }

    .nt-card { background: #fff; border-radius: 18px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04); width: 100%; max-width: 100%; overflow: hidden; box-sizing: border-box; }
    .nt-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; min-width: 0; }
    .nt-card-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #F1F5F9; color: #64748B; }
    .nt-card-icon--orange { background: #FEF3C7; color: #D97706; }
    .nt-card-icon--blue { background: #DBEAFE; color: #2563EB; }
    .nt-card-title { font-size: 15px; font-weight: 700; color: #1E293B; margin: 0; }
    .nt-card-sub { font-size: 11px; color: #94A3B8; display: block; margin-top: 1px; }

    .nt-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; width: 100%; }
    .nt-select-wrap { position: relative; display: flex; align-items: center; width: 100%; }
    .nt-select-icon { position: absolute; left: 14px; color: #94A3B8; pointer-events: none; z-index: 1; flex-shrink: 0; }
    .nt-select {
      width: 100%; height: 48px; padding: 0 36px 0 40px;
      border: 2px solid #E2E8F0; border-radius: 12px;
      font-size: 14px; font-weight: 500; font-family: inherit;
      background: #F8FAFC; color: #1E293B; outline: none;
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
      cursor: pointer; transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .nt-opt { overflow: hidden; text-overflow: ellipsis; }
    .nt-select:focus { border-color: #2563EB; }

    .nt-resume { display: flex; gap: 12px; padding: 12px; background: #F8FAFC; border-radius: 12px; width: 100%; box-sizing: border-box; }
    .nt-resume-item { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .nt-resume-label { font-size: 10px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.4px; }
    .nt-resume-value { font-size: 13px; font-weight: 600; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .nt-resume-value--mono { font-family: 'SF Mono','Fira Code',monospace; font-variant-numeric: tabular-nums; }

    .nt-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; }
    .nt-action {
      width: 100%; display: flex; align-items: center; gap: 14px;
      height: 64px; padding: 0 18px; border: none; border-radius: 16px;
      font-size: 14px; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.15s; color: #fff; text-align: left;
      position: relative; overflow: hidden;
    }
    .nt-action::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
      pointer-events: none;
    }
    .nt-action:active { transform: scale(0.98); }
    .nt-action:disabled { opacity: 0.5; transform: none; }
    .nt-action--email { background: linear-gradient(135deg, #2563EB, #1D4ED8); box-shadow: 0 6px 20px rgba(37,99,235,0.3); }
    .nt-action--email:hover { box-shadow: 0 8px 28px rgba(37,99,235,0.4); }
    .nt-action--whatsapp { background: linear-gradient(135deg, #25D366, #1DA851); box-shadow: 0 6px 20px rgba(37,211,102,0.3); }
    .nt-action--whatsapp:hover { box-shadow: 0 8px 28px rgba(37,211,102,0.4); }
    .nt-action-icon {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; background: rgba(255,255,255,0.18);
      backdrop-filter: blur(2px); position: relative; z-index: 1;
    }
    .nt-action-icon svg { width: 20px; height: 20px; }
    .nt-action-body { display: flex; flex-direction: column; gap: 2px; position: relative; z-index: 1; }
    .nt-action-title { font-size: 15px; font-weight: 700; line-height: 1.2; }
    .nt-action-desc { font-size: 11px; font-weight: 500; opacity: 0.7; }
    .nt-action-spin {
      margin-left: auto; animation: ntSpin 0.8s linear infinite; position: relative; z-index: 1;
    }
    @keyframes ntSpin { to { transform: rotate(360deg); } }

    .nt-timeline { display: flex; flex-direction: column; gap: 10px; }
    .nt-item { display: flex; gap: 10px; background: #F8FAFC; border-radius: 14px; padding: 14px; animation: ntItemIn 0.3s ease both; opacity: 0; }
    @keyframes ntItemIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .nt-item-bar { width: 4px; border-radius: 2px; flex-shrink: 0; background: #E2E8F0; }
    .nt-item-bar--ok { background: #10B981; }
    .nt-item-bar--fail { background: #EF4444; }
    .nt-item-body { flex: 1; min-width: 0; }
    .nt-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .nt-item-type { font-size: 13px; font-weight: 700; color: #1E293B; }
    .nt-badge { font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }
    .nt-badge--ok { background: #D1FAE5; color: #059669; }
    .nt-badge--fail { background: #FEE2E2; color: #DC2626; }
    .nt-item-meta { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
    .nt-item-to { font-size: 12px; font-weight: 500; color: #64748B; }
    .nt-item-date { font-size: 11px; color: #94A3B8; }
    .nt-item-msg { }
    .nt-item-msg p {
      font-size: 10px; color: #475569; line-height: 1.3; margin: 0;
    }
    .nt-msg-preview { display: block; }
    .nt-item-msg-btn {
      background: none; border: none; padding: 3px 0 0; cursor: pointer;
      font-size: 10px; font-weight: 600; color: #2563EB; font-family: inherit;
    }

    .nt-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px 16px; text-align: center; }
    .nt-empty-icon { width: 48px; height: 48px; border-radius: 50%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; color: #94A3B8; }
    .nt-empty-text { font-size: 14px; font-weight: 500; color: #94A3B8; margin: 0; }

    .nt-modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.4);
      display: flex; align-items: flex-end; justify-content: center;
    }
    .nt-modal {
      background: #fff; width: 100%; max-height: 60vh; overflow-y: auto;
      border-radius: 20px 20px 0 0; padding: 20px 18px 28px;
      animation: ntModalUp 0.2s ease both;
    }
    @keyframes ntModalUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .nt-modal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .nt-modal-type { font-size: 14px; font-weight: 700; color: #1E293B; }
    .nt-modal-close { background: none; border: none; cursor: pointer; color: #94A3B8; padding: 4px; }
    .nt-modal-meta { display: flex; justify-content: space-between; font-size: 12px; color: #94A3B8; margin-bottom: 12px; }
    .nt-modal-body { font-size: 14px; line-height: 1.5; color: #334155; }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .nt { padding-left: 0; padding-right: 0; }
      .nt-card { padding: 10px; border-radius: 14px; }
      .nt-card-head { gap: 8px; margin-bottom: 10px; }
      .nt-card-icon { width: 32px; height: 32px; }
      .nt-card-icon svg { width: 16px; height: 16px; }
      .nt-card-title { font-size: 13px; }
      .nt-card-sub { font-size: 10px; }
      .nt-field { margin-bottom: 8px; }
      .nt-actions { flex-direction: column; gap: 10px; }
      .nt-action { width: 100%; font-size: 13px; height: 58px; gap: 12px; padding: 0 14px; }
      .nt-action-icon { width: 38px; height: 38px; }
      .nt-action-icon svg { width: 18px; height: 18px; }
      .nt-action-title { font-size: 14px; }
      .nt-action-desc { font-size: 10px; }
      .nt-select { font-size: 11px; height: 42px; padding: 0 28px 0 32px; }
      .nt-select-icon { left: 10px; width: 14px; height: 14px; }
      .nt-resume { flex-wrap: wrap; gap: 4px; padding: 8px; }
      .nt-resume-item { min-width: calc(50% - 4px); }
      .nt-resume-label { font-size: 9px; }
      .nt-resume-value { font-size: 11px; }
      .nt-timeline { gap: 8px; }
      .nt-item { padding: 10px; gap: 8px; border-radius: 12px; }
      .nt-item-bar { width: 3px; }
      .nt-item-type { font-size: 11px; }
      .nt-item-to { font-size: 10px; }
      .nt-item-date { font-size: 9px; }
      .nt-item-msg p { font-size: 10px; }
      .nt-badge { font-size: 8px; padding: 1px 6px; }
      .nt-empty { padding: 20px 10px; gap: 6px; }
      .nt-empty-icon { width: 40px; height: 40px; }
      .nt-empty-icon svg { width: 22px; height: 22px; }
      .nt-empty-text { font-size: 12px; }
    }
  `]
})
export class NotificationHistoryComponent implements OnInit {
  reservas: Reservation[] = [];
  notificaciones: Notification[] = [];
  selectedReservaId = 0;
  sending = false;
  modalMsg: Notification | null = null;

  constructor(
    private notificationService: NotificationService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.reservationService.findAll().subscribe((data) => (this.reservas = data));
  }

  get selectedReserva(): Reservation | undefined {
    return this.reservas.find(r => r.id === this.selectedReservaId);
  }

  onSelectChange(): void {
    this.notificaciones = [];
    if (this.selectedReservaId) {
      this.loadNotificaciones();
    }
  }

  loadNotificaciones(): void {
    if (!this.selectedReservaId) return;
    this.notificationService.findByReservation(this.selectedReservaId).subscribe({
      next: (data) => (this.notificaciones = data),
    });
  }

  sendEmail(): void {
    this.sending = true;
    this.notificationService.sendEmail(this.selectedReservaId).subscribe({
      next: () => {
        this.sending = false;
        this.loadNotificaciones();
      },
      error: () => {
        this.sending = false;
      }
    });
  }

  sendWhatsApp(): void {
    this.sending = true;
    const telefono = this.selectedReserva?.clienteCelular;
    this.notificationService.sendWhatsApp(this.selectedReservaId).subscribe({
      next: () => {
        this.sending = false;
        this.loadNotificaciones();
        if (telefono) {
          const msg = encodeURIComponent(
            `Hola ${this.selectedReserva?.clienteNombre}! Te informamos sobre tu reserva ${this.selectedReserva?.codigoReserva} en ${this.selectedReserva?.ambienteNombre}.`
          );
          window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${msg}`, '_blank');
        }
      },
      error: () => {
        this.sending = false;
      }
    });
  }

  truncate(text: string | undefined, max: number): string {
    if (!text) return '';
    return text.length > max ? text.substring(0, max) + '...' : text;
  }

  openMsgModal(n: Notification): void {
    this.modalMsg = n;
  }
}
