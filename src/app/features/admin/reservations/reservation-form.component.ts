import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../core/services/reservation.service';
import { ClientService } from '../../../core/services/client.service';
import { EnvironmentService } from '../../../core/services/environment.service';
import { Reservation, Disponibilidad } from '../../../models/reservation.model';
import { Client } from '../../../models/client.model';
import { Environment } from '../../../models/environment.model';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="rf" [class.rf--mobile]="isMobile">
      <!-- Header -->
      <div class="rf-header">
        <button class="rf-header-back" (click)="cancel()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
        <div class="rf-header-info">
          <h1 class="rf-header-title">Nueva Reserva</h1>
          <span class="rf-header-subtitle">Paso {{ step }} de 4</span>
        </div>
        <div class="rf-header-spacer"></div>
      </div>

      <!-- Stepper -->
      <div class="rf-stepper">
        <div class="rf-stepper-track">
          <div class="rf-stepper-progress" [style.width.%]="((step - 1) / 3) * 100"></div>
        </div>
        <div class="rf-stepper-steps">
          <button *ngFor="let s of steps; let i = index" class="rf-step" [class.rf-step--done]="step > i + 1" [class.rf-step--active]="step === i + 1" [disabled]="step <= i + 1" (click)="step = i + 1">
            <div class="rf-step-circle">
              <svg *ngIf="step > i + 1" class="rf-step-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span *ngIf="step <= i + 1">{{ i + 1 }}</span>
            </div>
            <span class="rf-step-label">{{ s }}</span>
          </button>
        </div>
      </div>

      <!-- Step Content -->
      <div class="rf-body">

        <!-- Step 1: Cliente -->
        <div class="rf-step-panel" *ngIf="step === 1" [@slideIn]="step">
          <div class="rf-card">
            <div class="rf-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h2 class="rf-card-title">¿Quién reserva?</h2>
            <p class="rf-card-desc">Selecciona el cliente para esta reserva</p>

            <!-- Selected client pill -->
            <div class="cl-pill" *ngIf="model.clientId && selectedClient" (click)="model.clientId = 0; searchQuery = ''">
              <div class="cl-pill-avatar">{{ selectedClient.nombre | slice:0:1 }}</div>
              <div class="cl-pill-info">
                <span class="cl-pill-name">{{ selectedClient.nombre }}</span>
                <span class="cl-pill-phone">{{ selectedClient.celular }}</span>
              </div>
              <button class="cl-pill-x" (click)="$event.stopPropagation(); model.clientId = 0; searchQuery = ''">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Search -->
            <div class="cl-search" *ngIf="!model.clientId">
              <svg class="cl-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input class="cl-search-input" type="text" [(ngModel)]="searchQuery" name="clientSearch" placeholder="Buscar cliente por nombre o teléfono..." autocomplete="off" />
            </div>

            <!-- List -->
            <div class="cl-list" *ngIf="!model.clientId">
              <button *ngFor="let c of filteredClients" class="cl-item" (click)="selectClient(c.id!)">
                <div class="cl-item-avatar" [style.background]="getClientColor(c.id!)">{{ c.nombre | slice:0:1 }}</div>
                <div class="cl-item-body">
                  <span class="cl-item-name">{{ c.nombre }}</span>
                  <span class="cl-item-phone">{{ c.celular }}</span>
                </div>
                <div class="cl-item-check" *ngIf="model.clientId === c.id">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              </button>
              <div class="cl-empty" *ngIf="filteredClients.length === 0">
                <span class="cl-empty-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                </span>
                <span class="cl-empty-text">No se encontraron clientes</span>
                <a routerLink="/clientes/nuevo" class="cl-empty-link">+ Nuevo cliente</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Ambiente -->
        <div class="rf-step-panel" *ngIf="step === 2" [@slideIn]="step">
          <div class="rf-card">
            <div class="rf-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h2 class="rf-card-title">¿Qué ambiente?</h2>
            <p class="rf-card-desc">Selecciona el ambiente para la reserva</p>

            <!-- Environment Cards -->
            <div class="env-grid">
              <button *ngFor="let e of environments" class="env-card" [class.env-card--selected]="model.environmentId === e.id" (click)="selectEnv(e)">
                <div class="env-card-icon">
                  <span class="material-icons">meeting_room</span>
                </div>
                <div class="env-card-body">
                  <span class="env-card-name">{{ e.nombre }}</span>
                  <span class="env-card-price">S/ {{ e.precioBase | number:'1.2-2' }}</span>
                  <span class="env-card-type">{{ e.tipo === 'EVENTO' ? 'Evento' : 'Por horas' }}</span>
                </div>
                <div class="env-card-check" *ngIf="model.environmentId === e.id">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              </button>
            </div>

            <!-- Price Editor -->
            <div class="env-price-section" *ngIf="selectedEnv">
              <div class="env-price-divider"></div>
              <div class="rf-field">
                <label class="rf-label">Monto total *</label>
                <div class="rf-input-wrap">
                  <span class="rf-input-prefix">S/</span>
                  <input type="number" [(ngModel)]="model.precioTotal" name="precioTotal" class="rf-input rf-input--price" min="0" step="0.01" (ngModelChange)="onPriceChange()" />
                </div>
                <span class="rf-field-hint">
                  Subtotal: S/ {{ (precioBaseManual ?? selectedEnv.precioBase) | number:'1.2-2' }}
                  <ng-container *ngIf="selectedEnv.tipo === 'HORAS' && model.horaInicio && model.horaFin"> (× {{ getEnvFactor() }}h)</ng-container>.
                  Adicionales se suman aparte.
                </span>
              </div>

              <!-- Extras -->
              <div class="env-extras">
                <span class="env-extras-title">Adicionales</span>
                <label class="env-extra" [class.env-extra--on]="incluirSillas">
                  <div class="env-extra-left">
                    <div class="env-extra-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><path d="M6 16v4"/><path d="M18 16v4"/></svg>
                    </div>
                    <div class="env-extra-body">
                      <span class="env-extra-name">Sillas adicionales</span>
                      <span class="env-extra-price">+ S/ {{ PRECIO_SILLAS | number:'1.2-2' }}</span>
                    </div>
                  </div>
                  <div class="env-extra-toggle">
                    <input type="checkbox" [checked]="incluirSillas" (change)="toggleSillas()" />
                    <span class="env-extra-slider"></span>
                  </div>
                </label>
                <label class="env-extra" [class.env-extra--on]="incluirMotor">
                  <div class="env-extra-left">
                    <div class="env-extra-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <div class="env-extra-body">
                      <span class="env-extra-name">Motor de energía / luz</span>
                      <span class="env-extra-price">+ S/ {{ PRECIO_MOTOR | number:'1.2-2' }}</span>
                    </div>
                  </div>
                  <div class="env-extra-toggle">
                    <input type="checkbox" [checked]="incluirMotor" (change)="toggleMotor()" />
                    <span class="env-extra-slider"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Fecha y Hora -->
        <div class="rf-step-panel" *ngIf="step === 3" [@slideIn]="step">
          <div class="rf-card">
            <div class="rf-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h2 class="rf-card-title">¿Cuándo?</h2>
            <p class="rf-card-desc">Selecciona la fecha y horario del evento</p>
            <div class="rf-field">
              <label class="rf-label">Tipo de evento</label>
              <div class="rf-event-grid">
                <button *ngFor="let t of tiposEvento" class="rf-event-chip" [class.rf-event-chip--active]="tipoEvento === t" (click)="tipoEvento = t" type="button">
                  {{ t }}
                </button>
              </div>
              <div class="rf-event-custom" *ngIf="tipoEvento === 'Otro'">
                <input type="text" [(ngModel)]="tipoEventoOtro" name="tipoEventoOtro" class="rf-input" placeholder="Especifica el evento..." autocomplete="off" />
              </div>
            </div>
            <div class="rf-field">
              <label class="rf-label">Fecha del evento</label>
              <div class="rf-date-box" (click)="datePicker.showPicker()">
                <input #datePicker type="date" [(ngModel)]="model.fechaEvento" name="fechaEvento" required class="rf-date-native" [min]="hoyStr" (change)="checkDisponibilidad()" />
                <div class="rf-date-display">
                  <div class="rf-date-display-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div class="rf-date-display-text">
                    <span class="rf-date-display-day" *ngIf="model.fechaEvento">{{ model.fechaEvento | date:"d 'de' MMMM 'de' yyyy":"":"es-PE" }}</span>
                    <span class="rf-date-display-placeholder" *ngIf="!model.fechaEvento">Seleccionar fecha</span>
                  </div>
                  <svg class="rf-date-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <!-- Toggle hours for EVENTO type -->
            <div class="rf-toggle-hours" *ngIf="selectedEnv?.tipo === 'EVENTO'">
              <label class="rf-extra-toggle">
                <span class="rf-extra-toggle-label">Especificar horario</span>
                <div class="rf-extra-toggle-wrap">
                  <input type="checkbox" [(ngModel)]="usarHoras" name="usarHoras" (change)="onToggleHoras()" />
                  <span class="rf-extra-slider"></span>
                </div>
              </label>
            </div>

            <div class="rf-field-row" *ngIf="selectedEnv?.tipo === 'HORAS' || (selectedEnv?.tipo === 'EVENTO' && usarHoras)">
              <div class="rf-field rf-field--half">
                <label class="rf-label">Entrada</label>
                <input type="time" [(ngModel)]="model.horaInicio" name="horaInicio" class="rf-input" (change)="calcularPrecio()" />
              </div>
              <div class="rf-field rf-field--half">
                <label class="rf-label">Salida</label>
                <input type="time" [(ngModel)]="model.horaFin" name="horaFin" class="rf-input" (change)="calcularPrecio()" />
              </div>
            </div>

            <!-- Disponibilidad -->
            <div class="rf-availability" *ngIf="disponibilidad" [class.rf-availability--ok]="disponibilidad.disponible" [class.rf-availability--no]="!disponibilidad.disponible">
              <div class="rf-availability-icon">
                <svg *ngIf="disponibilidad.disponible" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <svg *ngIf="!disponibilidad.disponible" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <div class="rf-availability-text">
                <strong>{{ disponibilidad.mensaje }}</strong>
                <span *ngIf="disponibilidad.horariosOcupados.length > 0">
                  Ocupado: {{ disponibilidad.horariosOcupados.join(', ') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Confirmar -->
        <div class="rf-step-panel" *ngIf="step === 4" [@slideIn]="step">
          <div class="rf-card">
            <div class="rf-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 class="rf-card-title">Revisa todo</h2>
            <p class="rf-card-desc">Confirma que los datos sean correctos</p>

            <div class="rf-summary">
              <div class="rf-summary-item">
                <div class="rf-summary-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div class="rf-summary-body">
                  <span class="rf-summary-label">Cliente</span>
                  <strong class="rf-summary-value">{{ getClientName() }}</strong>
                </div>
              </div>
              <div class="rf-summary-item">
                <div class="rf-summary-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div class="rf-summary-body">
                  <span class="rf-summary-label">Ambiente</span>
                  <strong class="rf-summary-value">{{ getEnvName() }}</strong>
                  <span class="rf-summary-sub">S/ {{ getEnvPrice() | number:'1.2-2' }}</span>
                </div>
              </div>
              <div class="rf-summary-item">
                <div class="rf-summary-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div class="rf-summary-body">
                  <span class="rf-summary-label">Fecha</span>
                  <strong class="rf-summary-value">{{ model.fechaEvento | date:"fullDate":"":"es-PE" }}</strong>
                  <span class="rf-summary-sub" *ngIf="tipoEvento">{{ tipoEvento }}</span>
                </div>
              </div>
              <div class="rf-summary-item" *ngIf="model.horaInicio">
                <div class="rf-summary-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="rf-summary-body">
                  <span class="rf-summary-label">Horario</span>
                  <strong class="rf-summary-value">{{ model.horaInicio }} — {{ model.horaFin }}</strong>
                </div>
              </div>
              <div class="rf-summary-item" *ngIf="incluirSillas || incluirMotor">
                <div class="rf-summary-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
                <div class="rf-summary-body">
                  <span class="rf-summary-label">Adicionales</span>
                  <div class="rf-summary-extras">
                    <div class="rf-summary-extra" *ngIf="incluirSillas">
                      <span>Sillas</span>
                      <span>S/ {{ PRECIO_SILLAS | number:'1.2-2' }}</span>
                    </div>
                    <div class="rf-summary-extra" *ngIf="incluirMotor">
                      <span>Motor</span>
                      <span>S/ {{ PRECIO_MOTOR | number:'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rf-summary-divider"></div>
              <div class="rf-summary-total">
                <span>Total a pagar</span>
                <strong>S/ {{ model.precioTotal | number:'1.2-2' }}</strong>
              </div>
            </div>

            <div class="rf-field">
              <label class="rf-label">Notas (opcional)</label>
              <textarea [(ngModel)]="model.notas" name="notas" class="rf-textarea" rows="2" placeholder="Algún detalle adicional..."></textarea>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Navigation -->
      <div class="rf-bottom" *ngIf="step < 4">
        <button class="rf-btn rf-btn--secondary" *ngIf="step > 1" (click)="step = step - 1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Atrás
        </button>
        <button class="rf-btn rf-btn--primary" [disabled]="!canGoNext()" (click)="nextStep()">
          Continuar
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>

      <!-- Last step: Submit -->
      <div class="rf-bottom" *ngIf="step === 4">
        <button class="rf-btn rf-btn--secondary" (click)="step = 3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          Atrás
        </button>
        <button class="rf-btn rf-btn--primary rf-btn--submit" [disabled]="!model.clientId || !model.environmentId || !model.fechaEvento" (click)="onSubmit()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Confirmar Reserva
        </button>
      </div>

      <!-- Toast -->
      <div class="rf-toast" *ngIf="toastMsg">
        <span class="rf-toast-text">{{ toastMsg }}</span>
      </div>
    </div>
  `,
  styles: [`
    /* ── Reset & Root ── */
    .rf { display: block; }
    .rf * { box-sizing: border-box; }

    /* ── Header ── */
    .rf-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px 0; margin-bottom: 8px;
    }
    .rf-header-back {
      width: 40px; height: 40px; border-radius: 12px;
      border: none; background: var(--color-background-alt, #F1F5F9);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      color: var(--color-text-primary, #0F172A); flex-shrink: 0;
      transition: background 0.2s;
    }
    .rf-header-back:hover { background: var(--color-border, #E2E8F0); }
    .rf-header-info { flex: 1; min-width: 0; }
    .rf-header-title {
      font-size: 1.25rem; font-weight: 700; margin: 0;
      color: var(--color-text-primary, #0F172A);
    }
    .rf-header-subtitle {
      font-size: 0.8rem; color: var(--color-text-tertiary, #94A3B8);
      font-weight: 500;
    }
    .rf-header-spacer { width: 40px; flex-shrink: 0; }

    /* ── Stepper ── */
    .rf-stepper { padding: 20px 20px 8px; }
    .rf-stepper-track {
      height: 4px; background: var(--color-border, #E2E8F0);
      border-radius: 2px; margin-bottom: 12px; position: relative; overflow: hidden;
    }
    .rf-stepper-progress {
      height: 100%; background: linear-gradient(90deg, #1D4ED8, #3B82F6);
      border-radius: 2px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
    }
    .rf-stepper-steps {
      display: flex; justify-content: space-between;
    }
    .rf-step {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer; padding: 0;
      min-width: 0; flex: 1;
    }
    .rf-step:disabled { cursor: default; }
    .rf-step-circle {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700;
      background: var(--color-border, #E2E8F0); color: var(--color-text-tertiary, #94A3B8);
      transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      position: relative;
    }
    .rf-step-circle svg { width: 16px; height: 16px; }
    .rf-step--active .rf-step-circle {
      background: linear-gradient(135deg, #1D4ED8, #3B82F6);
      color: white; box-shadow: 0 4px 14px rgba(29,78,216,0.35);
      transform: scale(1.1);
    }
    .rf-step--done .rf-step-circle {
      background: #10B981; color: white;
    }
    .rf-step-label {
      font-size: 0.65rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.3px; color: var(--color-text-tertiary, #94A3B8);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
    }
    .rf-step--active .rf-step-label { color: var(--color-primary, #1D4ED8); font-weight: 700; }
    .rf-step--done .rf-step-label { color: #10B981; }

    /* ── Body ── */
    .rf-body {
      padding: 12px 20px 100px;
    }

    /* ── Card ── */
    .rf-card {
      background: white; border-radius: 20px; padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
      max-width: 400px; margin: 0 auto;
    }
    .rf-card-icon {
      width: 52px; height: 52px; border-radius: 16px;
      background: linear-gradient(135deg, rgba(29,78,216,0.1), rgba(59,130,246,0.08));
      display: flex; align-items: center; justify-content: center;
      color: var(--color-primary, #1D4ED8); margin-bottom: 16px;
    }
    .rf-card-title {
      font-size: 1.2rem; font-weight: 700; margin: 0 0 4px;
      color: var(--color-text-primary, #0F172A);
    }
    .rf-card-desc {
      font-size: 0.85rem; color: var(--color-text-tertiary, #94A3B8);
      margin: 0 0 20px;
    }

    /* ── Fields ── */
    .rf-field { display: flex; flex-direction: column; gap: 6px; }
    .rf-field + .rf-field { margin-top: 16px; }
    .rf-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
    .rf-field--half { margin-top: 0 !important; }
    .rf-label {
      font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary, #475569);
    }
    .rf-select, .rf-input {
      width: 100%; padding: 14px 16px;
      border: 2px solid var(--color-border, #E2E8F0);
      border-radius: 14px; font-size: 1rem; font-family: inherit;
      background: var(--color-background, #F8FAFC);
      color: var(--color-text-primary, #0F172A);
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none; appearance: none;
    }
    .rf-select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 16px center;
      padding-right: 40px;
    }
    .rf-select--icon { padding-left: 42px; }
    .rf-select-wrap { position: relative; display: flex; align-items: center; }
    .rf-select-icon {
      position: absolute; left: 14px; z-index: 1;
      color: var(--color-text-tertiary, #94A3B8);
      pointer-events: none;
    }
    .rf-select:focus, .rf-input:focus {
      border-color: var(--color-primary, #1D4ED8);
      box-shadow: 0 0 0 4px rgba(29,78,216,0.1);
    }

    /* Event grid */
    .rf-event-grid {
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    .rf-event-chip {
      padding: 8px 14px; border: 2px solid #E2E8F0;
      border-radius: 14px; background: #F8FAFC;
      font-family: inherit; font-size: 13px; font-weight: 500;
      color: #475569; cursor: pointer; transition: all 0.12s;
    }
    .rf-event-chip:active { transform: scale(0.95); }
    .rf-event-chip--active {
      border-color: #2563EB; background: rgba(37,99,235,0.08);
      color: #2563EB; font-weight: 700;
    }
    .rf-event-custom { margin-top: 8px; }

    /* Fecha custom */
    .rf-date-box { position: relative; }
    .rf-date-native {
      position: absolute; inset: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer; z-index: 2;
    }
    .rf-date-native::-webkit-calendar-picker-indicator {
      position: absolute; inset: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer;
    }
    .rf-date-native::-webkit-datetime-edit { display: none; }
    .rf-date-display {
      display: flex; align-items: center; gap: 12px;
      padding: 0 16px;
      height: 54px;
      border: 2px solid #E2E8F0; border-radius: 16px;
      background: #F8FAFC; transition: all 0.2s;
      box-sizing: border-box;
    }
    .rf-date-box:focus-within .rf-date-display {
      border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
      background: #fff;
    }
    .rf-date-box:active .rf-date-display { transform: scale(0.98); }
    .rf-date-display-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: #DBEAFE; color: #2563EB;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .rf-date-display-text { flex: 1; min-width: 0; }
    .rf-date-display-day {
      font-size: 15px; font-weight: 600; color: #1E293B;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .rf-date-display-placeholder { font-size: 15px; font-weight: 500; color: #94A3B8; }
    .rf-date-chevron { color: #94A3B8; flex-shrink: 0; transition: transform 0.2s; }
    .rf-date-box:focus-within .rf-date-chevron { transform: rotate(180deg); }

    .rf-textarea {
      width: 100%; padding: 14px 16px;
      border: 2px solid var(--color-border, #E2E8F0);
      border-radius: 14px; font-size: 1rem; font-family: inherit;
      background: var(--color-background, #F8FAFC);
      color: var(--color-text-primary, #0F172A);
      outline: none; resize: vertical; transition: border-color 0.2s;
    }
    .rf-textarea:focus { border-color: var(--color-primary, #1D4ED8); }
    .rf-field-hint {
      font-size: 0.75rem; color: var(--color-text-tertiary, #94A3B8);
      margin-top: 2px;
    }

    /* ── Client Selector ── */
    .cl-search {
      position: relative; margin-bottom: 16px;
    }
    .cl-search-icon {
      position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
      color: var(--color-text-tertiary, #94A3B8); pointer-events: none;
    }
    .cl-search-input {
      width: 100%; padding: 14px 16px 14px 42px;
      border: 2px solid var(--color-border, #E2E8F0);
      border-radius: 14px; font-size: 0.9rem; font-family: inherit;
      background: var(--color-background, #F8FAFC);
      color: var(--color-text-primary, #0F172A);
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .cl-search-input:focus {
      border-color: var(--color-primary, #1D4ED8);
      box-shadow: 0 0 0 4px rgba(29,78,216,0.1);
    }
    .cl-search-input::placeholder { color: var(--color-text-tertiary, #94A3B8); }

    .cl-list {
      display: flex; flex-direction: column; gap: 6px;
      max-height: 280px; overflow-y: auto;
      margin: 0 -4px; padding: 0 4px;
    }
    .cl-list::-webkit-scrollbar { width: 4px; }
    .cl-list::-webkit-scrollbar-thumb { background: var(--color-border, #E2E8F0); border-radius: 2px; }

    .cl-item {
      display: flex; align-items: center; gap: 12px;
      width: 100%; padding: 12px 14px;
      border: 2px solid transparent; border-radius: 14px;
      background: var(--color-background, #F8FAFC);
      cursor: pointer; text-align: left; font-family: inherit;
      transition: all 0.15s;
    }
    .cl-item:hover { background: var(--color-background-alt, #F1F5F9); }
    .cl-item:active { transform: scale(0.98); }
    .cl-item-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 0.9rem; font-weight: 700; flex-shrink: 0;
    }
    .cl-item-body { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    .cl-item-name { font-size: 0.9rem; font-weight: 600; color: var(--color-text-primary, #0F172A); }
    .cl-item-phone { font-size: 0.8rem; color: var(--color-text-tertiary, #94A3B8); font-weight: 500; }
    .cl-item-check {
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--color-success, #10B981);
      color: white; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .cl-empty {
      display: flex; flex-direction: column; align-items: center;
      padding: 24px 8px; gap: 8px;
    }
    .cl-empty-icon { color: var(--color-text-tertiary, #94A3B8); }
    .cl-empty-text { font-size: 0.85rem; color: var(--color-text-tertiary, #94A3B8); }
    .cl-empty-link {
      font-size: 0.8rem; color: var(--color-primary, #1D4ED8);
      font-weight: 600; text-decoration: none;
      padding: 8px 16px; border-radius: 10px;
      background: var(--color-primary-light, #DBEAFE);
    }

    /* Selected client pill */
    .cl-pill {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; margin-bottom: 4px;
      border-radius: 14px; cursor: pointer;
      background: linear-gradient(135deg, rgba(29,78,216,0.06), rgba(59,130,246,0.04));
      border: 2px solid rgba(29,78,216,0.15);
      transition: all 0.15s;
    }
    .cl-pill:active { transform: scale(0.98); }
    .cl-pill-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, #1D4ED8, #3B82F6);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 1rem; font-weight: 700; flex-shrink: 0;
    }
    .cl-pill-info { flex: 1; min-width: 0; }
    .cl-pill-name { font-size: 0.95rem; font-weight: 700; color: var(--color-text-primary, #0F172A); display: block; }
    .cl-pill-phone { font-size: 0.8rem; color: var(--color-text-tertiary, #94A3B8); font-weight: 500; }
    .cl-pill-x {
      width: 30px; height: 30px; border: none; border-radius: 50%;
      background: transparent; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--color-text-tertiary, #94A3B8);
      transition: all 0.15s; flex-shrink: 0;
    }
    .cl-pill-x:hover { background: rgba(0,0,0,0.05); color: var(--color-text-primary, #0F172A); }

    /* ── Environment Cards ── */
    .env-grid {
      display: flex; flex-direction: column; gap: 10px;
    }
    .env-card {
      display: flex; align-items: center; gap: 14px;
      width: 100%; padding: 14px 16px;
      border: 2px solid var(--color-border, #E2E8F0);
      border-radius: 16px;
      background: var(--color-background, #F8FAFC);
      cursor: pointer; text-align: left; font-family: inherit;
      transition: all 0.2s;
      position: relative;
    }
    .env-card:hover { border-color: var(--color-primary-light, #DBEAFE); background: #F1F5F9; }
    .env-card:active { transform: scale(0.98); }
    .env-card--selected {
      border-color: var(--color-primary, #2563EB);
      background: rgba(37,99,235,0.05);
      box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
    }
    .env-card-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: var(--color-primary-light, #DBEAFE);
      display: flex; align-items: center; justify-content: center;
      color: var(--color-primary, #2563EB);
      flex-shrink: 0;
    }
    .env-card-icon .material-icons { font-size: 20px; }
    .env-card-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .env-card-name { font-size: 15px; font-weight: 600; color: #1E293B; }
    .env-card-price { font-size: 14px; font-weight: 700; color: #1E293B; font-variant-numeric: tabular-nums; }
    .env-card-type { font-size: 11px; color: var(--color-text-tertiary, #94A3B8); font-weight: 500; }
    .env-card-check {
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--color-primary, #2563EB);
      color: #fff; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── Price Editor ── */
    .env-price-section { margin-top: 8px; }
    .env-price-divider { height: 1px; background: var(--color-border, #E2E8F0); margin: 18px 0 16px; }
    .rf-input-wrap {
      position: relative; display: flex; align-items: center;
    }
    .rf-input-prefix {
      position: absolute; left: 16px;
      font-size: 1rem; font-weight: 700; color: var(--color-text-primary, #0F172A);
      pointer-events: none;
    }
    .rf-input--price {
      padding-left: 36px;
      font-size: 1.15rem; font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.01em;
    }

    /* ── Extras ── */
    .env-extras {
      margin-top: 16px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .env-extras-title {
      font-size: 12px; font-weight: 600; color: var(--color-text-secondary, #475569);
      letter-spacing: 0.2px;
    }
    .env-extra {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 14px;
      border: 2px solid var(--color-border, #E2E8F0);
      border-radius: 14px;
      background: var(--color-background, #F8FAFC);
      cursor: pointer; transition: all 0.2s;
    }
    .env-extra:hover { border-color: var(--color-primary-light, #DBEAFE); }
    .env-extra--on {
      border-color: var(--color-primary, #2563EB);
      background: rgba(37,99,235,0.04);
    }
    .env-extra-left { display: flex; align-items: center; gap: 12px; }
    .env-extra-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--color-primary-light, #DBEAFE);
      display: flex; align-items: center; justify-content: center;
      color: var(--color-primary, #2563EB); flex-shrink: 0;
    }
    .env-extra-body { display: flex; flex-direction: column; }
    .env-extra-name { font-size: 14px; font-weight: 600; color: #1E293B; }
    .env-extra-price { font-size: 12px; font-weight: 600; color: var(--color-primary, #2563EB); }
    .env-extra-toggle { position: relative; flex-shrink: 0; }
    .env-extra-toggle input {
      position: absolute; opacity: 0; width: 0; height: 0;
    }
    .env-extra-slider {
      display: block; width: 44px; height: 24px;
      background: var(--color-border, #E2E8F0);
      border-radius: 12px; transition: all 0.25s;
      position: relative; cursor: pointer;
    }
    .env-extra-slider::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #fff; transition: all 0.25s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .env-extra--on .env-extra-slider {
      background: var(--color-primary, #2563EB);
    }
    .env-extra--on .env-extra-slider::after {
      left: 22px;
    }

    /* ── Toggle hours for EVENTO ── */
    .rf-toggle-hours { margin-top: 12px; }
    .rf-extra-toggle {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px;
      border: 2px solid var(--color-border, #E2E8F0);
      border-radius: 12px;
      background: var(--color-background, #F8FAFC);
      cursor: pointer;
    }
    .rf-extra-toggle-label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-primary, #0F172A); }
    .rf-extra-toggle-wrap { position: relative; display: flex; align-items: center; }
    .rf-extra-toggle-wrap input { position: absolute; opacity: 0; width: 0; height: 0; }
    .rf-extra-slider {
      display: block; width: 44px; height: 24px;
      background: var(--color-border, #E2E8F0);
      border-radius: 12px; transition: all 0.25s;
      position: relative; cursor: pointer;
    }
    .rf-extra-slider::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #fff; transition: all 0.25s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .rf-extra-toggle input:checked + .rf-extra-slider { background: var(--color-primary, #2563EB); }
    .rf-extra-toggle input:checked + .rf-extra-slider::after { left: 22px; }

    /* ── Preview (step 2) ── */
    .rf-preview {
      margin-top: 16px;
      background: var(--color-background, #F8FAFC);
      border-radius: 14px; padding: 16px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .rf-preview-row {
      display: flex; justify-content: space-between; align-items: center;
    }
    .rf-preview-label { font-size: 0.8rem; color: var(--color-text-tertiary, #94A3B8); }
    .rf-preview-value { font-size: 0.9rem; font-weight: 700; color: var(--color-text-primary, #0F172A); }
    .rf-preview-tag {
      font-size: 0.7rem; font-weight: 600; padding: 4px 10px;
      border-radius: 20px; background: var(--color-primary-light, #DBEAFE);
      color: var(--color-primary, #1D4ED8); text-transform: uppercase; letter-spacing: 0.3px;
    }

    /* ── Availability ── */
    .rf-availability {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px; border-radius: 14px; margin-top: 16px;
      font-size: 0.85rem; line-height: 1.4;
    }
    .rf-availability--ok { background: #ECFDF5; color: #065F46; }
    .rf-availability--no { background: #FEF2F2; color: #991B1B; }
    .rf-availability-icon { flex-shrink: 0; margin-top: 1px; }
    .rf-availability-text { display: flex; flex-direction: column; gap: 2px; }
    .rf-availability-text span { font-size: 0.75rem; opacity: 0.8; }

    /* ── Summary ── */
    .rf-summary { background: var(--color-background, #F8FAFC); border-radius: 16px; padding: 20px; }
    .rf-summary-item {
      display: flex; align-items: center; gap: 12px; padding: 8px 0;
    }
    .rf-summary-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: white; display: flex; align-items: center; justify-content: center;
      color: var(--color-primary, #1D4ED8); flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .rf-summary-body { display: flex; flex-direction: column; gap: 1px; }
    .rf-summary-label { font-size: 0.75rem; color: var(--color-text-tertiary, #94A3B8); }
    .rf-summary-value { font-size: 0.9rem; color: var(--color-text-primary, #0F172A); }
    .rf-summary-sub { font-size: 0.75rem; color: var(--color-text-tertiary, #94A3B8); font-weight: 500; margin-top: 1px; }
    .rf-summary-extras { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; }
    .rf-summary-extra { display: flex; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--color-text-primary, #0F172A); }
    .rf-summary-extra span:last-child { color: var(--color-text-primary, #0F172A); font-weight: 700; font-variant-numeric: tabular-nums; }
    .rf-summary-divider { height: 1px; background: var(--color-border, #E2E8F0); margin: 12px 0; }
    .rf-summary-total {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 4px;
    }
    .rf-summary-total span { font-size: 0.9rem; font-weight: 600; color: var(--color-text-primary, #0F172A); }
    .rf-summary-total strong {
      font-size: 1.3rem; font-weight: 800;
      background: linear-gradient(135deg, #1D4ED8, #3B82F6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Bottom Navigation ── */
    .rf-bottom {
      position: fixed; bottom: 0; left: 0; right: 0;
      padding: 12px 20px;
      padding-bottom: max(12px, env(safe-area-inset-bottom));
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid var(--color-border, #E2E8F0);
      display: flex; gap: 12px; z-index: 100;
    }
    .rf-btn {
      flex: 1; display: flex; align-items: center; justify-content: center;
      gap: 8px; padding: 16px 24px; border-radius: 14px;
      font-size: 1rem; font-weight: 700; font-family: inherit;
      cursor: pointer; border: none; transition: all 0.2s;
    }
    .rf-btn--primary {
      background: linear-gradient(135deg, #1D4ED8, #3B82F6);
      color: white; box-shadow: 0 4px 14px rgba(29,78,216,0.3);
    }
    .rf-btn--primary:active { transform: scale(0.97); }
    .rf-btn--primary:disabled { opacity: 0.4; transform: none; }
    .rf-btn--secondary {
      background: var(--color-background-alt, #F1F5F9);
      color: var(--color-text-primary, #0F172A);
      flex: 0.6;
    }
    .rf-btn--secondary:active { transform: scale(0.97); }
    .rf-btn--submit { background: linear-gradient(135deg, #059669, #10B981); box-shadow: 0 4px 14px rgba(16,185,129,0.3); }
    .rf-btn svg { flex-shrink: 0; }

    /* ── Step Panel Animation ── */
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .rf-step-panel { animation: slideInRight 0.35s cubic-bezier(0.4,0,0.2,1) both; }
    .rf-step-panel:last-child { animation-name: slideInLeft; }

    /* ── Desktop Overrides ── */
    @media (min-width: 769px) {
      .rf { max-width: 640px; margin: 0 auto; padding: 24px 0; }
      .rf-header { padding: 0 0 8px; }
      .rf-stepper { padding: 24px 0 12px; }
      .rf-body { padding: 12px 0 24px; }
      .rf-bottom {
        position: static;
        padding: 16px 0 0; margin-top: 8px;
        background: transparent; backdrop-filter: none;
        border-top: none;
      }
      .rf-card { padding: 28px; }
    }

    /* ── Mobile Safe Area ── */
    @media (max-width: 768px) {
      .rf-bottom { padding-bottom: max(12px, env(safe-area-inset-bottom)); }
    }

    /* ── Toast ── */
    .rf-toast {
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      z-index: 999;
      padding: 14px 20px;
      background: #DC2626; color: #fff;
      border-radius: 14px;
      font-size: 14px; font-weight: 600;
      box-shadow: 0 4px 20px rgba(220,38,38,0.3);
      animation: rfToastIn 0.25s ease both;
      max-width: 90%;
      text-align: center;
    }
    @keyframes rfToastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `]
})
export class ReservationFormComponent implements OnInit {
  step = 1;
  clients: Client[] = [];
  environments: Environment[] = [];
  selectedEnv?: Environment;
  disponibilidad?: Disponibilidad;
  isMobile = true;
  searchQuery = '';
  tipoEvento = '';
  tipoEventoOtro = '';
  usarHoras = false;
  readonly tiposEvento = [
    'Cumpleaños', 'Boda', 'Quinceañero', 'Aniversario',
    'Reunión familiar', 'Evento empresarial', 'Bautizo',
    'Primera comunión', 'Graduación', 'Baby shower',
    'Amigo secreto', 'Otro'
  ];

  steps = ['Cliente', 'Ambiente', 'Fecha', 'Confirmar'];

  readonly PRECIO_SILLAS = 50;
  readonly PRECIO_MOTOR = 120;
  incluirSillas = false;
  incluirMotor = false;
  /** Precio por unidad (hora) que el usuario definió manualmente */
  precioBaseManual: number | null = null;

  clientColors = ['#2563EB','#7C3AED','#059669','#D97706','#DC2626','#0891B2','#4F46E5','#BE185D'];

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  model: Reservation = {
    clientId: 0,
    environmentId: 0,
    fechaEvento: '',
    horaInicio: '',
    horaFin: '',
    precioTotal: 0,
    notas: '',
  };

  constructor(
    private reservationService: ReservationService,
    private clientService: ClientService,
    private environmentService: EnvironmentService
  ) {
    this.isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.clientService.findAll().subscribe((data) => (this.clients = data));
    this.environmentService.findAll().subscribe((data) => (this.environments = data));
  }

  get filteredClients(): Client[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.clients;
    return this.clients.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      (c.celular && c.celular.includes(q))
    );
  }

  get selectedClient(): Client | undefined {
    return this.clients.find(c => c.id === this.model.clientId);
  }

  get hoyStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  getClientColor(id: number): string {
    return this.clientColors[id % this.clientColors.length];
  }

  selectClient(id: number): void {
    this.model.clientId = id;
    this.searchQuery = '';
  }

  selectEnv(env: Environment): void {
    this.model.environmentId = env.id!;
    this.model.precioTotal = env.precioBase;
    this.model.horaInicio = '';
    this.model.horaFin = '';
    this.selectedEnv = env;
    this.incluirSillas = false;
    this.incluirMotor = false;
    this.precioBaseManual = null;
    this.usarHoras = false;
    this.disponibilidad = undefined;
    this.checkDisponibilidad();
  }

  onToggleHoras(): void {
    if (!this.usarHoras) {
      this.model.horaInicio = '';
      this.model.horaFin = '';
    }
    this.recalcularTotal();
  }

  private recalcularTotal(): void {
    if (!this.selectedEnv) return;

    // Determine hours factor
    let factor = 1;
    if (this.selectedEnv.tipo === 'HORAS' && this.model.horaInicio && this.model.horaFin) {
      const [h1, m1] = this.model.horaInicio.split(':').map(Number);
      const [h2, m2] = this.model.horaFin.split(':').map(Number);
      factor = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
    }

    // Determine per-unit price: manual override or env base
    const unitPrice = this.precioBaseManual ?? this.selectedEnv.precioBase;

    let total = unitPrice * factor;
    if (this.incluirSillas) total += this.PRECIO_SILLAS;
    if (this.incluirMotor) total += this.PRECIO_MOTOR;
    this.model.precioTotal = Math.max(0, total);
  }

  toggleSillas(): void {
    this.incluirSillas = !this.incluirSillas;
    this.recalcularTotal();
  }

  toggleMotor(): void {
    this.incluirMotor = !this.incluirMotor;
    this.recalcularTotal();
  }

  onPriceChange(): void {
    this.captureManualPrecio();
  }

  /** Derive precioBaseManual (price per unit) from whatever model.precioTotal currently holds */
  private captureManualPrecio(): void {
    if (!this.model.precioTotal || this.model.precioTotal < 0) {
      this.precioBaseManual = null;
      return;
    }
    let subtotal = this.model.precioTotal;
    if (this.incluirSillas) subtotal -= this.PRECIO_SILLAS;
    if (this.incluirMotor) subtotal -= this.PRECIO_MOTOR;
    subtotal = Math.max(0, subtotal);

    let factor = 1;
    if (this.selectedEnv?.tipo === 'HORAS' && this.model.horaInicio && this.model.horaFin) {
      const [h1, m1] = this.model.horaInicio.split(':').map(Number);
      const [h2, m2] = this.model.horaFin.split(':').map(Number);
      factor = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
    }
    this.precioBaseManual = subtotal / factor;
    this.recalcularTotal();
  }

  canGoNext(): boolean {
    switch (this.step) {
      case 1: return !!this.model.clientId;
      case 2: return !!this.model.environmentId;
      case 3: return !!this.model.fechaEvento;
      default: return false;
    }
  }

  nextStep(): void {
    if (this.canGoNext() && this.step < 4) this.step++;
  }

  checkDisponibilidad(): void {
    if (this.model.environmentId && this.model.fechaEvento) {
      this.reservationService.checkDisponibilidad(this.model.environmentId, this.model.fechaEvento).subscribe({
        next: (d) => (this.disponibilidad = d),
        error: () => {},
      });
    }
  }

  calcularPrecio(): void {
    this.recalcularTotal();
  }

  getClientName(): string {
    return this.selectedClient?.nombre || '';
  }

  getEnvName(): string {
    return this.environments.find((e) => e.id === this.model.environmentId)?.nombre || '';
  }

  getEnvPrice(): number {
    return this.precioBaseManual ?? this.selectedEnv?.precioBase ?? 0;
  }

  getEnvFactor(): number {
    if (this.selectedEnv?.tipo === 'HORAS' && this.model.horaInicio && this.model.horaFin) {
      const [h1, m1] = this.model.horaInicio.split(':').map(Number);
      const [h2, m2] = this.model.horaFin.split(':').map(Number);
      return Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
    }
    return 1;
  }

  onSubmit(): void {
    // Recalculate before save to ensure correct total
    this.recalcularTotal();
    this.model.tipoEvento = this.tipoEvento === 'Otro' ? (this.tipoEventoOtro || undefined) : (this.tipoEvento || undefined);
    this.model.precioSillas = this.incluirSillas ? this.PRECIO_SILLAS : undefined;
    this.model.precioMotor = this.incluirMotor ? this.PRECIO_MOTOR : undefined;
    // Clear hours for EVENTO when hours toggle is off
    if (this.selectedEnv?.tipo === 'EVENTO' && !this.usarHoras) {
      this.model.horaInicio = '';
      this.model.horaFin = '';
    }
    this.reservationService.create(this.model).subscribe({
      next: (res) => {
        this.router.navigate(['/reservas', res.id]);
      },
      error: (err) => {
        const msg = err.error?.mensaje || 'Error al crear la reserva';
        this.showToast(msg);
      },
    });
  }

  cancel(): void { this.router.navigate(['/reservas']); }

  toastMsg = '';
  private showToast(msg: string): void {
    this.toastMsg = msg;
    setTimeout(() => this.toastMsg = '', 3500);
  }
}
