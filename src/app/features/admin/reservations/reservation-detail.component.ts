import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Reservation } from '../../../models/reservation.model';
import { Payment } from '../../../models/payment.model';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Skeleton -->
    <div class="rd-skeleton" *ngIf="!reserva">
      <div class="rd-skeleton-block" style="height:60px"></div>
      <div class="rd-skeleton-block" style="height:220px"></div>
      <div class="rd-skeleton-block" style="height:160px"></div>
    </div>

    <div class="rd" *ngIf="reserva">

      <!-- ═══ HEADER ═══ -->
      <div class="rd-topbar">
        <button class="rd-topbar-back" (click)="goBack()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
        <div class="rd-topbar-body">
          <div class="rd-topbar-status">
            <span class="rd-dot" [class]="'rd-dot--' + (reserva.estado || 'RESERVADO').toLowerCase()"></span>
            <span class="rd-topbar-label">{{ statusLabel }}</span>
          </div>
          <span class="rd-topbar-code">{{ reserva.codigoReserva }}</span>
        </div>
        <button class="rd-topbar-more" (click)="showMenu = !showMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
        </button>
        <div class="rd-dropdown" *ngIf="showMenu">
          <button class="rd-dropdown-item" *ngIf="canConfirm" (click)="showConfirmModal = true; showMenu = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            Confirmar reserva
          </button>
          <button class="rd-dropdown-item rd-dropdown--danger" *ngIf="canCancel" (click)="showCancelConfirm = true; showMenu = false">Cancelar reserva</button>
          <div class="rd-dropdown-empty" *ngIf="!canCancel && !canConfirm">Sin acciones disponibles</div>
        </div>
      </div>

      <!-- Cancel Confirm Modal -->
      <div class="rd-cancel-overlay" *ngIf="showCancelConfirm" (click)="showCancelConfirm = false"></div>
      <div class="rd-cancel-modal" *ngIf="showCancelConfirm">
        <div class="rd-cancel-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h3 class="rd-cancel-title">Cancelar reserva</h3>
        <p class="rd-cancel-desc">¿Estás seguro de cancelar la reserva <strong>{{ reserva.codigoReserva }}</strong>? Esta acción no se puede deshacer.</p>
        <div class="rd-cancel-actions">
          <button class="rd-cancel-btn rd-cancel-btn--back" (click)="showCancelConfirm = false">Volver</button>
          <button class="rd-cancel-btn rd-cancel-btn--confirm" (click)="confirmCancel()">Cancelar reserva</button>
        </div>
      </div>

      <!-- Confirm Modal -->
      <div class="rd-cancel-overlay" *ngIf="showConfirmModal" (click)="showConfirmModal = false"></div>
      <div class="rd-cancel-modal" *ngIf="showConfirmModal">
        <div class="rd-cancel-icon" style="background:#ECFDF5;color:#10B981;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 class="rd-cancel-title">Confirmar reserva</h3>
        <p class="rd-cancel-desc">¿Estás seguro de confirmar la reserva <strong>{{ reserva.codigoReserva }}</strong>?</p>
        <div class="rd-cancel-actions">
          <button class="rd-cancel-btn rd-cancel-btn--back" (click)="showConfirmModal = false">Volver</button>
          <button class="rd-cancel-btn rd-cancel-btn--confirm" style="background:#10B981;" (click)="confirmConfirm()">Confirmar</button>
        </div>
      </div>

      <div class="rd-scroll">

        <!-- ════════════════════════════════════════ -->
        <!-- FINANCIAL HERO — the main event         -->
        <!-- ════════════════════════════════════════ -->
        <div class="rd-hero">
          <div class="rd-hero-bg"></div>
          <div class="rd-hero-body">

            <!-- Balance destacado -->
            <div class="rd-hero-balance">
              <span class="rd-hero-balance-label">SALDO PENDIENTE</span>
              <strong class="rd-hero-balance-value">S/ {{ (reserva.saldoPendiente || reserva.precioTotal) | number:'1.2-2' }}</strong>
            </div>

            <!-- Barra de progreso -->
            <div class="rd-hero-progress">
              <div class="rd-hero-progress-track">
                <div class="rd-hero-progress-fill" [style.width.%]="paymentPercent"></div>
              </div>
              <div class="rd-hero-progress-stats">
                <span>Pagado: <strong>S/ {{ (reserva.totalPagado || 0) | number:'1.2-2' }}</strong></span>
                <span>{{ paymentPercent }}%</span>
              </div>
            </div>

            <!-- Total y resumen -->
            <div class="rd-hero-meta">
              <div class="rd-hero-meta-item">
                <span class="rd-hero-meta-lbl">Total reserva</span>
                <span class="rd-hero-meta-val">S/ {{ reserva.precioTotal | number:'1.2-2' }}</span>
              </div>
              <div class="rd-hero-meta-divider"></div>
              <div class="rd-hero-meta-item">
                <span class="rd-hero-meta-lbl">Estado</span>
                <span class="rd-hero-meta-badge" [class]="'rd-hero-meta-badge--' + (reserva.estadoPago || 'PENDIENTE').toLowerCase()">{{ paymentStatusLabel }}</span>
              </div>
            </div>

            <!-- Acciones rápidas del hero -->
            <div class="rd-hero-actions">
              <button class="rd-hero-btn rd-hero-btn--primary" (click)="showPayForm = !showPayForm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {{ showPayForm ? 'Cerrar' : 'Registrar Pago' }}
              </button>
              <button class="rd-hero-btn rd-hero-btn--ghost" (click)="showInfo = !showInfo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                {{ showInfo ? 'Ocultar detalles' : 'Ver detalles' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════════ -->
        <!-- PAYMENT FORM — MODAL BOTTOM SHEET      -->
        <!-- ════════════════════════════════════════ -->
        <div class="pm-overlay" *ngIf="showPayForm" (click)="showPayForm = false"></div>
        <div class="pm-sheet" *ngIf="showPayForm">
          <div class="pm-handle"></div>
          <div class="pm-header">
            <div class="pm-header-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div>
              <h3 class="pm-title">Nuevo Pago</h3>
              <span class="pm-sub">Completa los datos del cobro</span>
            </div>
            <button class="pm-close" (click)="showPayForm = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="pm-body">
            <div class="pm-field">
              <label class="pm-label">Monto</label>
              <div class="pm-input-wrap">
                <span class="pm-prefix">S/</span>
                <input type="number" [(ngModel)]="pagoMonto" class="pm-input" placeholder="0.00" step="0.01" />
              </div>
            </div>
            <div class="pm-row">
              <div class="pm-field pm-field--half">
                <label class="pm-label">Tipo</label>
                <select [(ngModel)]="pagoTipo" class="pm-select">
                  <option value="ADELANTO">Adelanto</option>
                  <option value="SALDO">Saldo</option>
                  <option value="COMPLETO">Completo</option>
                </select>
              </div>
              <div class="pm-field pm-field--half">
                <label class="pm-label">Método</label>
                <select [(ngModel)]="pagoMetodo" class="pm-select">
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="YAPE">Yape</option>
                  <option value="TARJETA">Tarjeta</option>
                </select>
              </div>
            </div>
          </div>
          <div class="pm-footer">
            <button class="pm-btn" [disabled]="!pagoMonto || pagoMonto <= 0 || paying" (click)="registrarPago()">
              <span class="rd-spinner" *ngIf="paying"></span>
              <svg *ngIf="!paying" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ paying ? 'Registrando...' : 'Confirmar Pago' }}</span>
            </button>
          </div>
        </div>

        <!-- ════════════════════════════════════════ -->
        <!-- PAYMENT HISTORY                          -->
        <!-- ════════════════════════════════════════ -->
        <div class="rd-section" *ngIf="pagos.length > 0">
          <div class="rd-section-head">
            <div class="rd-section-icon rd-section-icon--green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h3 class="rd-section-title">Historial</h3>
              <span class="rd-section-sub">{{ pagos.length }} {{ pagos.length === 1 ? 'pago' : 'pagos' }} registrados</span>
            </div>
          </div>
          <div class="rd-timeline">
            <div class="rd-timeline-item" *ngFor="let p of pagos; let i = index">
              <div class="rd-timeline-dot" [class.rd-timeline-dot--last]="i === pagos.length - 1">
                <div class="rd-timeline-icon rd-timeline-icon--ok">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
              <div class="rd-timeline-body">
                <div class="rd-timeline-top">
                  <strong class="rd-timeline-type">{{ p.tipoPago }}</strong>
                  <span class="rd-timeline-amount">+ S/ {{ p.monto | number:'1.2-2' }}</span>
                </div>
                <span class="rd-timeline-meta">{{ p.metodoPago }} · {{ p.fechaPago | date:"dd MMM yyyy HH:mm":"":"es-PE" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════════ -->
        <!-- RESERVATION INFO (collapsible)          -->
        <!-- ════════════════════════════════════════ -->
        <div class="rd-section" *ngIf="showInfo">
          <div class="rd-section-head">
            <div class="rd-section-icon rd-section-icon--blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <h3 class="rd-section-title">Detalles de la Reserva</h3>
              <span class="rd-section-sub">Información del cliente y evento</span>
            </div>
          </div>
          <div class="rd-info">
            <div class="rd-info-banner">
              <div class="rd-avatar">{{ initials }}</div>
              <div>
                <strong class="rd-info-name">{{ reserva.clienteNombre }}</strong>
                <span class="rd-info-contact">{{ reserva.clienteCelular }}</span>
                <span class="rd-info-contact" *ngIf="reserva.clienteEmail">{{ reserva.clienteEmail }}</span>
              </div>
            </div>
            <div class="rd-info-grid">
              <div class="rd-info-cell">
                <span class="rd-info-label">Ambiente</span>
                <strong>{{ reserva.ambienteNombre }}</strong>
              </div>
              <div class="rd-info-cell">
                <span class="rd-info-label">Fecha</span>
                <strong>{{ reserva.fechaEvento | date:"fullDate":"":"es-PE" }}</strong>
              </div>
              <div class="rd-info-cell" *ngIf="reserva.tipoEvento">
                <span class="rd-info-label">Tipo de evento</span>
                <strong>{{ reserva.tipoEvento }}</strong>
              </div>
              <div class="rd-info-cell" *ngIf="reserva.horaInicio">
                <span class="rd-info-label">Horario</span>
                <strong>{{ reserva.horaInicio }} — {{ reserva.horaFin }}</strong>
              </div>
              <div class="rd-info-cell" *ngIf="reserva.precioSillas || reserva.precioMotor">
                <span class="rd-info-label">Adicionales</span>
                <div class="rd-info-extras">
                  <span *ngIf="reserva.precioSillas">Sillas + S/ {{ reserva.precioSillas | number:'1.2-2' }}</span>
                  <span *ngIf="reserva.precioMotor">Motor + S/ {{ reserva.precioMotor | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
            <div class="rd-info-notes" *ngIf="reserva.notas">
              <span class="rd-info-label">Notas</span>
              <p>{{ reserva.notas }}</p>
            </div>
          </div>
        </div>

        <!-- ════════════════════════════════════════ -->
        <!-- QUICK ACTIONS (always visible)           -->
        <!-- ════════════════════════════════════════ -->
        <div class="rd-section rd-section--actions">
          <div class="rd-section-head">
            <div class="rd-section-icon rd-section-icon--orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
            </div>
            <div>
              <h3 class="rd-section-title">Notificar al Cliente</h3>
              <span class="rd-section-sub">Envía el comprobante de pago</span>
            </div>
          </div>
          <div class="rd-actions">
            <button class="rd-action rd-action--email" (click)="sendEmail()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Correo Electrónico
            </button>
            <button class="rd-action rd-action--whatsapp" (click)="sendWhatsApp()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </button>
          </div>
        </div>

      </div><!-- /rd-scroll -->

      <!-- ════════════════════════════════════════ -->
      <!-- TOAST                                    -->
      <!-- ════════════════════════════════════════ -->
      <div class="rd-toast" *ngIf="toastMsg">
        <span class="rd-toast-text">{{ toastMsg }}</span>
        <button class="rd-toast-close" (click)="toastMsg = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

    </div><!-- /rd -->
  `,
  styles: [`
    /* ── Reset ── */
    .rd * { box-sizing: border-box; }

    /* ── Skeleton ── */
    .rd-skeleton { padding: 20px; }
    .rd-skeleton-block { background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%); background-size: 200% 100%; animation: rdShimmer 1.5s infinite; border-radius: 16px; margin-bottom: 16px; }
    @keyframes rdShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* ── Topbar ── */
    .rd-topbar {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; position: relative;
      background: white; border-bottom: 1px solid #E2E8F0;
    }
    .rd-topbar-back {
      width: 38px; height: 38px; border-radius: 12px;
      border: none; background: #F1F5F9; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #0F172A; flex-shrink: 0;
    }
    .rd-topbar-body { flex:1; min-width:0; }
    .rd-topbar-status { display:flex; align-items:center; gap:6px; margin-bottom:1px; }
    .rd-dot { width:8px; height:8px; border-radius:50%; background:#94A3B8; }
    .rd-dot--reservado { background:#1D4ED8; }
    .rd-dot--confirmado { background:#10B981; }
    .rd-dot--cancelado { background:#EF4444; }
    .rd-dot--finalizado { background:#94A3B8; }
    .rd-dot--en_proceso { background:#F59E0B; }
    .rd-topbar-label { font-size:.9rem; font-weight:700; color:#0F172A; }
    .rd-topbar-code { font-size:.72rem; color:#94A3B8; font-family:monospace; display:block; }
    .rd-topbar-more {
      width:38px; height:38px; border-radius:12px;
      border:none; background:transparent; cursor:pointer;
      display:flex; align-items:center; justify-content:center; color:#475569;
    }
    .rd-topbar-more:hover { background:#F1F5F9; }
    .rd-dropdown {
      position:absolute; top:56px; right:20px; z-index:100;
      background:white; border-radius:14px;
      box-shadow:0 8px 32px rgba(0,0,0,.12); padding:6px; min-width:170px;
    }
    .rd-dropdown-item {
      display:block; width:100%; padding:12px 16px; border:none;
      background:none; cursor:pointer; font-size:.9rem; font-weight:500;
      font-family:inherit; border-radius:10px; text-align:left;
    }
    .rd-dropdown--danger { color:#EF4444; }
    .rd-dropdown--danger:hover { background:#FEF2F2; }

    .rd-scroll {
      padding: 12px 16px 24px;
      display: flex; flex-direction: column; gap: 12px;
      min-height: calc(100dvh - 57px);
      justify-content: center;
    }

    /* ════════════════════════════════════════ */
    /* HERO — Financial Dashboard               */
    /* ════════════════════════════════════════ */
    .rd-hero {
      border-radius: 24px; overflow: hidden; position: relative;
      max-width: 560px; width: 100%; margin: 0 auto;
    }
    .rd-hero-bg {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      z-index: 0;
    }
    .rd-hero-body {
      position: relative; z-index: 1;
      padding: 20px 20px 16px;
    }
    .rd-hero-balance { text-align: center; margin-bottom: 12px; }
    .rd-hero-balance-label {
      font-size: .65rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 1.2px; color: rgba(255,255,255,.5);
      display: block; margin-bottom: 2px;
    }
    .rd-hero-balance-value {
      font-size: 2rem; font-weight: 800; color: white;
      display: block; letter-spacing: -1px;
    }

    .rd-hero-progress { margin-bottom: 12px; }
    .rd-hero-progress-track {
      height: 5px; background: rgba(255,255,255,.15);
      border-radius: 3px; overflow: hidden; margin-bottom: 6px;
    }
    .rd-hero-progress-fill {
      height: 100%; border-radius: 3px;
      background: linear-gradient(90deg, #10B981, #34D399);
      transition: width .6s ease;
    }
    .rd-hero-progress-stats {
      display: flex; justify-content: space-between;
      font-size: .7rem; color: rgba(255,255,255,.55);
    }
    .rd-hero-progress-stats strong { color: #34D399; }

    .rd-hero-meta {
      display: flex; align-items: center; justify-content: center; gap: 16px;
      padding: 12px 0; margin-bottom: 16px;
      border-top: 1px solid rgba(255,255,255,.08);
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .rd-hero-meta-item { text-align: center; }
    .rd-hero-meta-lbl {
      font-size: .65rem; text-transform: uppercase; letter-spacing: .8px;
      color: rgba(255,255,255,.45); display: block; margin-bottom: 2px;
    }
    .rd-hero-meta-val { font-size: 1rem; font-weight: 700; color: white; }
    .rd-hero-meta-divider { width:1px; height:32px; background:rgba(255,255,255,.1); }
    .rd-hero-meta-badge {
      font-size: .7rem; font-weight: 700; padding: 4px 12px;
      border-radius: 20px; text-transform: uppercase; letter-spacing: .3px;
    }
    .rd-hero-meta-badge--pendiente { background:rgba(245,158,11,.2); color:#FBBF24; }
    .rd-hero-meta-badge--parcial { background:rgba(59,130,246,.2); color:#60A5FA; }
    .rd-hero-meta-badge--pagado { background:rgba(16,185,129,.2); color:#34D399; }

    .rd-hero-actions { display: flex; gap: 10px; }
    .rd-hero-btn {
      flex: 1; display: flex; align-items: center; justify-content: center;
      gap: 8px; padding: 13px; border-radius: 14px;
      font-size: .85rem; font-weight: 700; font-family: inherit;
      cursor: pointer; border: none; transition: all .2s;
    }
    .rd-hero-btn:active { transform: scale(.97); }
    .rd-hero-btn--primary {
      background: linear-gradient(135deg, #1D4ED8, #3B82F6);
      color: white; box-shadow: 0 4px 14px rgba(29,78,216,.35);
    }
    .rd-hero-btn--ghost {
      background: rgba(255,255,255,.1); color: rgba(255,255,255,.85);
    }
    .rd-hero-btn--ghost:hover { background: rgba(255,255,255,.16); }

    /* ════════════════════════════════════════ */
    /* Section Card                             */
    /* ════════════════════════════════════════ */
    .rd-section {
      background: white; border-radius: 20px; padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.04);
      max-width: 560px; width: 100%; margin: 0 auto;
    }
    .rd-section--actions { margin-bottom: 0; }
    .rd-section-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .rd-section-icon {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .rd-section-icon--blue { background:rgba(29,78,216,.1); color:#1D4ED8; }
    .rd-section-icon--green { background:rgba(16,185,129,.1); color:#10B981; }
    .rd-section-icon--purple { background:rgba(139,92,246,.1); color:#8B5CF6; }
    .rd-section-icon--orange { background:rgba(245,158,11,.1); color:#F59E0B; }
    .rd-section-title { font-size:.95rem; font-weight:700; margin:0; color:#0F172A; }
    .rd-section-sub { font-size:.75rem; color:#94A3B8; display:block; margin-top:1px; }

    /* ════════════════════════════════════════ */
    /* PAYMENT MODAL — Bottom Sheet             */
    /* ════════════════════════════════════════ */
    .pm-overlay {
      position: fixed; inset: 0; z-index: 900;
      background: rgba(0,0,0,0.4);
      animation: pmFadeIn 0.2s ease both;
    }
    @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
    .pm-sheet {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 901;
      background: #fff;
      border-radius: 24px 24px 0 0;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.12);
      max-height: 85vh;
      overflow-y: auto;
      animation: pmSlideUp 0.3s cubic-bezier(0.32,1.2,0.5,1) both;
      padding: 12px 20px 24px;
      padding-bottom: max(24px, env(safe-area-inset-bottom));
    }
    @keyframes pmSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    .pm-handle {
      width: 36px; height: 4px;
      background: #E2E8F0; border-radius: 2px;
      margin: 0 auto 12px;
    }
    .pm-header {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 20px;
    }
    .pm-header-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: rgba(139,92,246,0.1); color: #8B5CF6;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .pm-title { font-size: 1rem; font-weight: 700; margin: 0; color: #0F172A; }
    .pm-sub { font-size: 0.75rem; color: #94A3B8; display: block; margin-top: 1px; }
    .pm-close {
      width: 36px; height: 36px; border-radius: 50%;
      border: none; background: #F1F5F9; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #475569; flex-shrink: 0; margin-left: auto;
      transition: background 0.15s;
    }
    .pm-close:active { background: #E2E8F0; }
    .pm-body { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
    .pm-field { display: flex; flex-direction: column; gap: 6px; }
    .pm-field--half { flex: 1; }
    .pm-row { display: flex; gap: 12px; }
    .pm-label { font-size: 0.8rem; font-weight: 600; color: #475569; }
    .pm-input-wrap {
      display: flex; align-items: center;
      border: 2px solid #E2E8F0; border-radius: 14px;
      background: #F8FAFC; transition: border-color 0.2s;
      height: 52px; box-sizing: border-box;
    }
    .pm-input-wrap:focus-within { border-color: #1D4ED8; box-shadow: 0 0 0 4px rgba(29,78,216,0.1); }
    .pm-prefix { padding-left: 16px; font-size: 1.15rem; font-weight: 700; color: #0F172A; flex-shrink: 0; line-height: 1; }
    .pm-input {
      flex: 1; border: none; background: transparent;
      padding: 0 16px 0 8px; min-width: 0;
      font-size: 1.15rem; font-weight: 700; font-family: inherit;
      outline: none; color: #0F172A; height: 48px;
    }
    .pm-input::placeholder { color: #94A3B8; font-weight: 400; }
    input[type=number].pm-input::-webkit-inner-spin-button,
    input[type=number].pm-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number].pm-input { -moz-appearance: textfield; }
    .pm-select {
      width: 100%; height: 52px; padding: 0 36px 0 16px;
      border: 2px solid #E2E8F0; border-radius: 14px;
      font-size: 0.9rem; font-weight: 600; font-family: inherit;
      background: #F8FAFC; color: #0F172A; outline: none;
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
      box-sizing: border-box;
    }
    .pm-select:focus { border-color: #1D4ED8; }
    .pm-btn {
      width: 100%; height: 52px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: linear-gradient(135deg, #1D4ED8, #3B82F6);
      color: #fff; border: none; border-radius: 14px;
      font-size: 1rem; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(29,78,216,0.3);
    }
    .pm-btn:active { transform: scale(0.97); }
    .pm-btn:disabled { opacity: 0.4; transform: none; }

    /* ── Spinner ── */
    .rd-spinner {
      width:18px; height:18px; border:2px solid rgba(255,255,255,.3);
      border-top-color:white; border-radius:50%; animation:rdSpin .6s linear infinite;
    }
    @keyframes rdSpin { to{transform:rotate(360deg)} }

    /* ════════════════════════════════════════ */
    /* Timeline (Payment History)               */
    /* ════════════════════════════════════════ */
    .rd-timeline { display:flex; flex-direction:column; }
    .rd-timeline-item { display:flex; gap:14px; }
    .rd-timeline-dot {
      display:flex; flex-direction:column; align-items:center;
      width:28px; flex-shrink:0; padding-top:4px;
      position:relative;
    }
    .rd-timeline-dot::after {
      content:''; width:2px; flex:1;
      background:#E2E8F0; margin-top:6px;
    }
    .rd-timeline-dot--last::after { display:none; }
    .rd-timeline-icon {
      width:28px; height:28px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
    }
    .rd-timeline-icon--ok { background:#ECFDF5; color:#10B981; }
    .rd-timeline-body { flex:1; padding-bottom:16px; min-width:0; }
    .rd-timeline-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
    .rd-timeline-type { font-size:.85rem; color:#0F172A; }
    .rd-timeline-amount { font-size:.9rem; font-weight:700; color:#10B981; white-space:nowrap; }
    .rd-timeline-meta { font-size:.72rem; color:#94A3B8; display:block; margin-top:2px; }

    /* ════════════════════════════════════════ */
    /* Toast                                    */
    /* ════════════════════════════════════════ */
    .rd-toast {
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      z-index: 999;
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px;
      background: #DC2626; color: #fff;
      border-radius: 14px;
      font-size: 14px; font-weight: 600;
      box-shadow: 0 4px 20px rgba(220,38,38,0.3);
      animation: rdToastIn 0.25s ease both;
      max-width: 90%;
    }
    @keyframes rdToastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .rd-toast-text { flex: 1; }
    .rd-toast-close {
      width: 24px; height: 24px; border: none; border-radius: 50%;
      background: rgba(255,255,255,0.15); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #fff; flex-shrink: 0;
    }

    /* ════════════════════════════════════════ */
    /* Cancel Modal                             */
    /* ════════════════════════════════════════ */
    .rd-cancel-overlay {
      position: fixed; inset: 0; z-index: 910;
      background: rgba(0,0,0,0.4);
      animation: rdCancelFade 0.2s ease both;
    }
    @keyframes rdCancelFade { from { opacity: 0; } to { opacity: 1; } }
    .rd-cancel-modal {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 911;
      background: #fff;
      border-radius: 24px 24px 0 0;
      padding: 24px 20px 28px;
      padding-bottom: max(28px, env(safe-area-inset-bottom));
      animation: rdCancelUp 0.3s cubic-bezier(0.32,1.2,0.5,1) both;
      text-align: center;
    }
    @keyframes rdCancelUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    .rd-cancel-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: #FEF2F2; color: #DC2626;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 12px;
    }
    .rd-cancel-title { font-size: 17px; font-weight: 700; color: #1E293B; margin: 0 0 6px; }
    .rd-cancel-desc { font-size: 14px; color: #64748B; margin: 0 0 20px; line-height: 1.4; }
    .rd-cancel-desc strong { color: #1E293B; }
    .rd-cancel-actions { display: flex; gap: 10px; }
    .rd-cancel-btn {
      flex: 1; height: 48px; border-radius: 14px;
      font-size: 15px; font-weight: 700; font-family: inherit;
      cursor: pointer; border: none; transition: all 0.15s;
    }
    .rd-cancel-btn:active { transform: scale(0.97); }
    .rd-cancel-btn--back { background: #F1F5F9; color: #475569; }
    .rd-cancel-btn--confirm { background: #DC2626; color: #fff; }

    /* ════════════════════════════════════════ */
    /* Info (collapsible)                       */
    /* ════════════════════════════════════════ */
    .rd-info { display:flex; flex-direction:column; gap:16px; }
    .rd-info-banner { display:flex; align-items:center; gap:14px; }
    .rd-avatar {
      width:44px; height:44px; border-radius:50%;
      background:linear-gradient(135deg,#1D4ED8,#3B82F6);
      color:white; display:flex; align-items:center; justify-content:center;
      font-size:.85rem; font-weight:700; flex-shrink:0;
    }
    .rd-info-name { display:block; font-size:.95rem; color:#0F172A; }
    .rd-info-contact { display:block; font-size:.8rem; color:#64748B; margin-top:1px; }
    .rd-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .rd-info-cell { 
      display:flex; flex-direction:column; gap:2px; 
      background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
      padding: 12px;
      border-radius: 12px;
      border: 1px solid #93C5FD;
    }
    .rd-info-label { font-size:.68rem; font-weight:600; color:#1E40AF; text-transform:uppercase; letter-spacing:.4px; }
    .rd-info-cell strong { font-size:.85rem; color:#1E3A8A; }
    .rd-info-extras { display: flex; flex-direction: column; gap: 1px; }
    .rd-info-extras span { font-size:.85rem; color:#1E3A8A; font-weight: 600; }
    .rd-info-notes {
      padding-top:14px; border-top:1px solid #E2E8F0;
      display:flex; flex-direction:column; gap:6px;
    }
    .rd-info-notes p { font-size:.82rem; color:#475569; margin:0; line-height:1.5; }

    /* ════════════════════════════════════════ */
    /* Action Buttons                           */
    /* ════════════════════════════════════════ */
    .rd-actions { display:flex; gap:12px; }
    .rd-action {
      flex:1; display:flex; align-items:center; justify-content:center; gap:8px;
      padding:14px; border-radius:14px;
      font-size:.85rem; font-weight:600; font-family:inherit;
      cursor:pointer; border:none; transition:all .2s;
    }
    .rd-action:active { transform:scale(.97); }
    .rd-action--email { background:linear-gradient(135deg,#1D4ED8,#3B82F6); color:white; box-shadow:0 4px 12px rgba(29,78,216,.25); }
    .rd-action--whatsapp { background:#25D366; color:white; box-shadow:0 4px 12px rgba(37,211,102,.25); }

    /* ════════════════════════════════════════ */
    /* Animation                                */
    /* ════════════════════════════════════════ */
    @keyframes rdUp {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .rd-hero { animation:rdUp .4s cubic-bezier(.4,0,.2,1) both; }
    .rd-section { animation:rdUp .4s cubic-bezier(.4,0,.2,1) both; }
    .rd-section:nth-child(2) { animation-delay:.06s; }
    .rd-section:nth-child(3) { animation-delay:.12s; }
    .rd-section:nth-child(4) { animation-delay:.18s; }

    /* ════════════════════════════════════════ */
    /* Desktop                                  */
    /* ════════════════════════════════════════ */
    @media (min-width: 769px) {
      .rd { max-width: 640px; margin: 0 auto; padding: 20px 0; }
      .rd-topbar { border-radius: 20px; border: none; margin-bottom: 4px; box-shadow:0 1px 3px rgba(0,0,0,.04); }
      .rd-scroll { padding: 0; gap: 16px; min-height: auto; justify-content: flex-start; }
    }

    /* ── Mobile Safe Area ── */
    @media (max-width: 768px) {
      .rd-scroll { padding-bottom: max(24px, calc(env(safe-area-inset-bottom) + 8px)); }
    }
  `]
})
export class ReservationDetailComponent implements OnInit {
  reserva?: Reservation;
  pagos: Payment[] = [];
  pagoMonto = 0;
  pagoTipo = 'ADELANTO';
  pagoMetodo = 'EFECTIVO';
  paying = false;
  showMenu = false;
  showPayForm = false;
  showInfo = false;
  showCancelConfirm = false;
  showConfirmModal = false;
  toastMsg = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(
    private reservationService: ReservationService,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadReserva(id);
    this.loadPagos(id);
  }

  get statusLabel(): string {
    const labels: Record<string, string> = {
      RESERVADO: 'Reservado',
      CONFIRMADO: 'Confirmado',
      EN_PROCESO: 'En Proceso',
      CANCELADO: 'Cancelado',
      FINALIZADO: 'Finalizado',
    };
    return labels[this.reserva?.estado || ''] || 'Reservado';
  }

  get paymentStatusLabel(): string {
    const e = this.reserva?.estadoPago || 'PENDIENTE';
    return { PENDIENTE: 'Pendiente', PARCIAL: 'Parcial', PAGADO: 'Pagado' }[e] || e;
  }

  get paymentPercent(): number {
    const total = this.reserva?.precioTotal || 0;
    const paid = this.reserva?.totalPagado || 0;
    if (total === 0) return 0;
    return Math.min(100, Math.round((paid / total) * 100));
  }

  get initials(): string {
    const name = this.reserva?.clienteNombre || '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  get canCancel(): boolean {
    return this.reserva?.estado !== 'CANCELADO' && this.reserva?.estado !== 'FINALIZADO';
  }

  get canConfirm(): boolean {
    return this.reserva?.estado === 'RESERVADO';
  }

  confirmarReserva(): void {
    this.showConfirmModal = true;
    this.showMenu = false;
  }

  confirmConfirm(): void {
    this.showConfirmModal = false;
    this.reservationService.updateStatus(this.reserva!.id!, 'CONFIRMADO').subscribe(() => {
      this.loadReserva(this.reserva!.id!);
    });
  }

  loadReserva(id: number): void {
    this.reservationService.findById(id).subscribe(data => this.reserva = data);
  }

  loadPagos(id: number): void {
    this.paymentService.findByReservation(id).subscribe(data => this.pagos = data);
  }

  registrarPago(): void {
    if (!this.pagoMonto || this.pagoMonto <= 0) { this.showToast('Ingresa un monto válido'); return; }
    this.paying = true;
    this.paymentService.create({
      reservationId: this.reserva!.id!,
      monto: this.pagoMonto,
      tipoPago: this.pagoTipo as any,
      metodoPago: this.pagoMetodo as any,
    }).subscribe({
      next: () => {
        this.loadReserva(this.reserva!.id!);
        this.loadPagos(this.reserva!.id!);
        this.pagoMonto = 0;
        this.paying = false;
      },
      error: (err) => {
        this.toastMsg = err.error?.mensaje || 'Error al registrar pago';
        this.paying = false;
      },
    });
  }

  cancelReserva(): void {
    this.showCancelConfirm = true;
    this.showMenu = false;
  }

  confirmCancel(): void {
    this.showCancelConfirm = false;
    this.reservationService.cancel(this.reserva!.id!).subscribe(() => {
      this.loadReserva(this.reserva!.id!);
    });
  }

  private showToast(msg: string): void {
    this.toastMsg = msg;
    setTimeout(() => this.toastMsg = '', 3000);
  }

  sendEmail(): void { this.notificationService.sendEmail(this.reserva!.id!).subscribe(); }
  sendWhatsApp(): void { this.notificationService.sendWhatsApp(this.reserva!.id!).subscribe(); }
  goBack(): void { this.router.navigate(['/reservas']); }
}
