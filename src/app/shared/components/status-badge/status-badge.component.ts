import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass">{{ displayText }}</span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 700;
      white-space: nowrap;
    }
    .badge-reservado { background: var(--color-primary-light); color: var(--color-primary); }
    .badge-confirmado { background: var(--color-success-light); color: var(--color-success); }
    .badge-en_proceso { background: var(--color-info-light); color: var(--color-info); }
    .badge-finalizado { background: var(--color-text-tertiary); color: var(--color-white); }
    .badge-cancelado { background: var(--color-danger-light); color: var(--color-danger); }
    .badge-pendiente { background: var(--color-warning-light); color: var(--color-warning); }
    .badge-parcial { background: var(--color-warning-light); color: var(--color-warning); }
    .badge-pagado { background: var(--color-success-light); color: var(--color-success); }
  `]
})
export class StatusBadgeComponent {
  @Input() type: 'reservation' | 'payment' = 'reservation';
  @Input() status = '';

  private reservationStatusMap: Record<string, { class: string; text: string }> = {
    'RESERVADO': { class: 'badge-reservado', text: 'Reservado' },
    'CONFIRMADO': { class: 'badge-confirmado', text: 'Confirmado' },
    'EN_PROCESO': { class: 'badge-en_proceso', text: 'En Proceso' },
    'FINALIZADO': { class: 'badge-finalizado', text: 'Finalizado' },
    'CANCELADO': { class: 'badge-cancelado', text: 'Cancelado' },
    'PENDIENTE': { class: 'badge-pendiente', text: 'Pendiente' },
    'PARCIAL': { class: 'badge-parcial', text: 'Parcial' },
    'PAGADO': { class: 'badge-pagado', text: 'Pagado' },
  };

  get badgeClass(): Record<string, boolean> {
    const key = this.status || 'PENDIENTE';
    const config = this.reservationStatusMap[key] || this.reservationStatusMap['PENDIENTE'];
    return { [config.class]: true };
  }

  get displayText(): string {
    const key = this.status || 'PENDIENTE';
    return this.reservationStatusMap[key]?.text || key;
  }
}
