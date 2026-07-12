import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="cf">
      <!-- Header -->
      <div class="cf-header">
        <button class="cf-back" (click)="cancel()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
        <h1 class="cf-title">{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>
        <div class="cf-spacer"></div>
      </div>

      <!-- Intro -->
      <div class="cf-intro">
        <div class="cf-intro-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="cf-intro-text">
          <h2 class="cf-intro-title">Información del cliente</h2>
          <p class="cf-intro-desc">Registra los datos necesarios para crear una nueva reserva.</p>
        </div>
      </div>

      <!-- Form -->
      <div class="cf-card">
        <form (ngSubmit)="onSubmit()" #form="ngForm">

          <!-- Nombre -->
          <div class="cf-field">
            <label class="cf-label">Nombre completo *</label>
            <div class="cf-input-wrap">
              <svg class="cf-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input type="text" [(ngModel)]="model.nombre" name="nombre" required class="cf-input" placeholder="Nombre completo" autocomplete="off" />
            </div>
          </div>

          <!-- Celular -->
          <div class="cf-field">
            <label class="cf-label">Celular *</label>
            <div class="cf-input-wrap">
              <svg class="cf-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <input type="tel" [(ngModel)]="model.celular" name="celular" required class="cf-input" placeholder="999 999 999" autocomplete="off" />
            </div>
          </div>

          <!-- Email -->
          <div class="cf-field">
            <label class="cf-label">Email</label>
            <div class="cf-input-wrap">
              <svg class="cf-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input type="email" [(ngModel)]="model.email" name="email" class="cf-input" placeholder="correo@ejemplo.com" autocomplete="off" />
            </div>
          </div>

          <!-- Documento -->
          <div class="cf-field">
            <label class="cf-label">Documento de identidad</label>
            <div class="cf-input-wrap">
              <svg class="cf-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <input type="text" [(ngModel)]="model.documentoIdentidad" name="documento" class="cf-input" placeholder="DNI / CE" autocomplete="off" />
            </div>
          </div>

          <!-- Dirección -->
          <div class="cf-field">
            <label class="cf-label">Dirección</label>
            <div class="cf-input-wrap">
              <svg class="cf-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <input type="text" [(ngModel)]="model.direccion" name="direccion" class="cf-input" placeholder="Dirección (opcional)" autocomplete="off" />
            </div>
          </div>

          <!-- Actions -->
          <div class="cf-actions">
            <button type="button" class="cf-btn cf-btn--secondary" (click)="cancel()">Cancelar</button>
            <button type="submit" class="cf-btn cf-btn--primary" [disabled]="!form.valid">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              {{ isEdit ? 'Actualizar Cliente' : 'Guardar Cliente' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    /* ============================================================
       CLIENT FORM — MOBILE-FIRST PREMIUM
       Diseño tipo registro de app bancaria/fintech
       ============================================================ */

    .cf {
      max-width: 480px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-top: 4px;
    }

    /* ===== HEADER ===== */
    .cf-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cf-back {
      width: 40px; height: 40px;
      border: none; border-radius: 12px;
      background: var(--color-background-alt, #F1F5F9);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--color-text-primary, #0F172A);
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .cf-back:hover { background: var(--color-border, #E2E8F0); }
    .cf-back:active { transform: scale(0.92); }
    .cf-title {
      font-size: 20px; font-weight: 700;
      color: var(--color-text-primary, #0F172A);
      margin: 0; flex: 1;
    }
    .cf-spacer { width: 40px; flex-shrink: 0; }

    /* ===== INTRO ===== */
    .cf-intro {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 4px 0;
    }
    .cf-intro-icon {
      width: 52px; height: 52px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(29,78,216,0.1), rgba(59,130,246,0.08));
      display: flex; align-items: center; justify-content: center;
      color: var(--color-primary, #1D4ED8);
      flex-shrink: 0;
    }
    .cf-intro-text { flex: 1; }
    .cf-intro-title {
      font-size: 17px; font-weight: 700;
      color: var(--color-text-primary, #0F172A);
      margin: 0 0 2px;
    }
    .cf-intro-desc {
      font-size: 13px;
      color: var(--color-text-tertiary, #94A3B8);
      margin: 0;
      line-height: 1.4;
    }

    /* ===== CARD ===== */
    .cf-card {
      background: #fff;
      border-radius: 20px;
      padding: 24px 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
    }

    /* ===== FIELDS ===== */
    .cf-field { display: flex; flex-direction: column; gap: 6px; }
    .cf-field + .cf-field { margin-top: 18px; }

    .cf-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-secondary, #475569);
      letter-spacing: 0.2px;
    }

    .cf-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .cf-input-icon {
      position: absolute;
      left: 14px;
      color: var(--color-text-tertiary, #94A3B8);
      pointer-events: none;
      transition: color 0.2s;
    }
    .cf-input:focus + .cf-input-icon,
    .cf-input-wrap:focus-within .cf-input-icon {
      color: var(--color-primary, #2563EB);
    }

    .cf-input {
      width: 100%;
      padding: 14px 16px 14px 42px;
      border: 2px solid var(--color-border, #E2E8F0);
      border-radius: 14px;
      font-size: 15px;
      font-weight: 500;
      font-family: inherit;
      background: var(--color-background, #F8FAFC);
      color: var(--color-text-primary, #0F172A);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      height: 50px;
    }
    .cf-input:focus {
      border-color: var(--color-primary, #2563EB);
      box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
      background: #fff;
    }
    .cf-input::placeholder {
      color: var(--color-text-tertiary, #94A3B8);
      font-weight: 400;
    }

    /* ===== ACTIONS ===== */
    .cf-actions {
      display: flex;
      gap: 10px;
      margin-top: 28px;
    }
    .cf-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px 20px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      height: 52px;
    }
    .cf-btn:active { transform: scale(0.97); }

    .cf-btn--primary {
      background: var(--color-primary, #2563EB);
      color: #fff;
      box-shadow: 0 4px 14px rgba(37,99,235,0.3);
    }
    .cf-btn--primary:disabled {
      opacity: 0.4;
      transform: none;
      box-shadow: none;
    }

    .cf-btn--secondary {
      background: var(--color-background-alt, #F1F5F9);
      color: var(--color-text-primary, #0F172A);
      flex: 0.6;
    }
    .cf-btn--secondary:hover { background: var(--color-border, #E2E8F0); }

    /* ===== ANIMATION ===== */
    .cf {
      animation: cfFadeIn 0.35s ease both;
    }
    @keyframes cfFadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ===== RESPONSIVE ===== */
    @media (min-width: 769px) {
      .cf { padding: 24px 0; gap: 24px; }
      .cf-card { padding: 28px; }
    }
  `]
})
export class ClientFormComponent implements OnInit {
  isEdit = false;
  clientId?: number;
  model: Client = { nombre: '', celular: '', email: '', documentoIdentidad: '', direccion: '' };
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.clientId = +id; this.clientService.findById(+id).subscribe(c => this.model = c); }
  }

  onSubmit(): void {
    const action = this.isEdit ? this.clientService.update(this.clientId!, this.model) : this.clientService.create(this.model);
    action.subscribe(() => this.router.navigate(['/clientes']));
  }

  cancel(): void { this.router.navigate(['/clientes']); }
}
