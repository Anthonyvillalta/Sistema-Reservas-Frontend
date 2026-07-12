import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation">
      <div class="confirmation-check">
        <div class="check-circle">
          <svg class="check-svg" viewBox="0 0 52 52">
            <circle class="check-circle-bg" cx="26" cy="26" r="25" fill="none" stroke="#10B981" stroke-width="2"/>
            <path class="check-mark" d="M14 27l7 7 16-16" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="confirmation-content">
        <h1 class="confirmation-title">Reserva confirmada</h1>

        <div class="confirmation-code">
          <span class="code-label">Código de reserva</span>
          <span class="code-value">{{ codigoReserva }}</span>
          <button class="code-copy" (click)="copiarCodigo()">
            {{ copiado ? '✓ Copiado' : '📋 Copiar' }}
          </button>
        </div>

        <div class="confirmation-detail">
          <div class="detail-item">
            <span class="detail-icon">📍</span>
            <div>
              <span class="detail-label">Ambiente</span>
              <span class="detail-value">{{ ambiente }}</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-icon">📅</span>
            <div>
              <span class="detail-label">Fecha</span>
              <span class="detail-value">{{ fecha }}</span>
            </div>
          </div>
          <div class="detail-item" *ngIf="hora">
            <span class="detail-icon">⏰</span>
            <div>
              <span class="detail-label">Hora</span>
              <span class="detail-value">{{ hora }}</span>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-icon">💰</span>
            <div>
              <span class="detail-label">Total</span>
              <span class="detail-value price">S/ {{ total | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>

        <div class="confirmation-info">
          <p>Se ha enviado un comprobante a tu correo electrónico con los detalles de la reserva.</p>
        </div>

        <button class="btn-view" (click)="verReservas()">Ver mis reservas</button>
        <button class="btn-home" (click)="volverInicio()">Volver al inicio</button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation { display: flex; flex-direction: column; align-items: center; padding-top: var(--space-8); }
    .confirmation-check { margin-bottom: var(--space-6); }
    .check-circle { width: 80px; height: 80px; }
    .check-svg { width: 100%; height: 100%; }
    .check-circle-bg { animation: scaleIn 0.5s ease forwards; }
    .check-mark { stroke-dasharray: 100; stroke-dashoffset: 100; animation: checkmark 0.8s ease 0.3s forwards; }
    .confirmation-content { text-align: center; width: 100%; }
    .confirmation-title { font-size: var(--text-2xl); font-weight: 700; color: var(--color-success); margin-bottom: var(--space-6); }
    .confirmation-code { background: var(--color-background-alt); border-radius: var(--radius-lg); padding: var(--space-4); margin-bottom: var(--space-6); }
    .code-label { display: block; font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; margin-bottom: var(--space-1); }
    .code-value { display: block; font-size: var(--text-xl); font-weight: 700; color: var(--color-primary); font-family: monospace; margin-bottom: var(--space-2); }
    .code-copy { background: none; border: 1px solid var(--color-border); padding: 6px 16px; border-radius: var(--radius-full); font-size: var(--text-sm); cursor: pointer; font-family: var(--font-family); }
    .confirmation-detail { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6); }
    .detail-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: var(--color-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); text-align: left; }
    .detail-icon { font-size: 1.25rem; }
    .detail-label { display: block; font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; }
    .detail-value { font-weight: 600; font-size: var(--text-sm); }
    .detail-value.price { color: var(--color-primary); font-size: var(--text-base); }
    .confirmation-info { background: var(--color-info-light); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-6); }
    .confirmation-info p { font-size: var(--text-sm); color: var(--color-info); line-height: 1.5; }
    .btn-view { width: 100%; padding: 16px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: var(--text-lg); font-weight: 600; cursor: pointer; font-family: var(--font-family); margin-bottom: var(--space-3); }
    .btn-home { width: 100%; padding: 14px; background: white; color: var(--color-text-primary); border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--text-base); font-weight: 600; cursor: pointer; font-family: var(--font-family); }
  `]
})
export class ConfirmationComponent implements OnInit {
  codigoReserva = '';
  ambiente = '';
  fecha = '';
  hora = '';
  total = 0;
  copiado = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Generate mock reservation code
    const year = new Date().getFullYear();
    const seq = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
    this.codigoReserva = `#R-${year}-${seq}`;
    this.route.queryParams.subscribe(p => {
      this.fecha = p['fecha'] || '';
      this.hora = p['hora'] || '';
      this.total = +(p['total'] || 0);
    });
  }

  copiarCodigo(): void {
    navigator.clipboard.writeText(this.codigoReserva).then(() => {
      this.copiado = true;
      setTimeout(() => this.copiado = false, 2000);
    });
  }

  verReservas(): void { this.router.navigate(['/m/mis-reservas']); }
  volverInicio(): void { this.router.navigate(['/m/home']); }
}
