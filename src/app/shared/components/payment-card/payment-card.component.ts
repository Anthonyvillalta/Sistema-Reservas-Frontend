import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Payment } from '../../../models/payment.model';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-card">
      <div class="payment-header">
        <span class="payment-type">{{ payment.tipoPago }}</span>
        <span class="payment-amount">S/ {{ payment.monto | number:'1.2-2' }}</span>
      </div>
      <div class="payment-details">
        <div class="detail-row">
          <span class="detail-label">Método</span>
          <span class="detail-value">{{ payment.metodoPago }}</span>
        </div>
        <div class="detail-row" *ngIf="payment.referencia">
          <span class="detail-label">Referencia</span>
          <span class="detail-value">{{ payment.referencia }}</span>
        </div>
        <div class="detail-row" *ngIf="payment.fechaPago">
          <span class="detail-label">Fecha</span>
          <span class="detail-value">{{ payment.fechaPago | date:'dd/MM/yyyy HH:mm':'':'es-PE' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-card { background: var(--color-surface); border-radius: var(--radius-md); padding: var(--space-3); border: 1px solid var(--color-border); }
    .payment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); }
    .payment-type { font-weight: 600; font-size: var(--text-sm); color: var(--color-primary); }
    .payment-amount { font-weight: 700; font-size: var(--text-lg); color: var(--color-success); }
    .payment-details { display: flex; flex-direction: column; gap: var(--space-1); }
    .detail-row { display: flex; justify-content: space-between; font-size: var(--text-xs); }
    .detail-label { color: var(--color-text-tertiary); }
    .detail-value { font-weight: 500; }
  `]
})
export class PaymentCardComponent {
  @Input() payment!: Payment;
}
