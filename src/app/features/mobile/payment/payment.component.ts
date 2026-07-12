import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mobile-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="payment">
      <div class="payment-summary">
        <div class="summary-amount">
          <span class="amount-label">Total a pagar</span>
          <span class="amount-value">S/ {{ total | number:'1.2-2' }}</span>
        </div>
        <div class="summary-detail">
          <div class="detail-row"><span>Adelanto (30%)</span><span>S/ {{ (total * 0.3) | number:'1.2-2' }}</span></div>
          <div class="detail-row"><span>Saldo pendiente</span><span>S/ {{ (total * 0.7) | number:'1.2-2' }}</span></div>
        </div>
      </div>

      <div class="payment-methods">
        <h3>Método de pago</h3>

        <label class="method-item" [class.selected]="metodo === 'yape'">
          <input type="radio" name="metodo" value="yape" [(ngModel)]="metodo" />
          <span class="method-icon">📱</span>
          <div class="method-info">
            <span class="method-name">Yape / Plin</span>
            <span class="method-desc">Paga desde tu app</span>
          </div>
          <span class="method-check">✓</span>
        </label>

        <label class="method-item" [class.selected]="metodo === 'transferencia'">
          <input type="radio" name="metodo" value="transferencia" [(ngModel)]="metodo" />
          <span class="method-icon">🏦</span>
          <div class="method-info">
            <span class="method-name">Transferencia bancaria</span>
            <span class="method-desc">BCP, Interbank, BBVA</span>
          </div>
          <span class="method-check">✓</span>
        </label>

        <label class="method-item" [class.selected]="metodo === 'tarjeta'">
          <input type="radio" name="metodo" value="tarjeta" [(ngModel)]="metodo" />
          <span class="method-icon">💳</span>
          <div class="method-info">
            <span class="method-name">Tarjeta de crédito/débito</span>
            <span class="method-desc">Visa, Mastercard</span>
          </div>
          <span class="method-check">✓</span>
        </label>

        <label class="method-item" [class.selected]="metodo === 'efectivo'">
          <input type="radio" name="metodo" value="efectivo" [(ngModel)]="metodo" />
          <span class="method-icon">💵</span>
          <div class="method-info">
            <span class="method-name">Efectivo</span>
            <span class="method-desc">Paga en el local</span>
          </div>
          <span class="method-check">✓</span>
        </label>
      </div>

      <div class="payment-reference" *ngIf="metodo === 'transferencia'">
        <h3>Datos de transferencia</h3>
        <div class="bank-info">
          <div class="bank-row"><span class="bank-label">Banco</span><span class="bank-value">BCP</span></div>
          <div class="bank-row"><span class="bank-label">Titular</span><span class="bank-value">Centro Recreacional José Antonio</span></div>
          <div class="bank-row"><span class="bank-label">Cuenta</span><span class="bank-value">193-XXXXXXX-0-XX</span></div>
          <div class="bank-row"><span class="bank-label">CCI</span><span class="bank-value">002-193-XXXXXXXXXX-XX</span></div>
        </div>
      </div>

      <div class="payment-reference" *ngIf="metodo === 'yape'">
        <h3>Datos de Yape</h3>
        <div class="bank-info">
          <div class="bank-row"><span class="bank-label">Número</span><span class="bank-value">999 XXX XXX</span></div>
          <div class="bank-row"><span class="bank-label">Titular</span><span class="bank-value">José Antonio</span></div>
        </div>
      </div>

      <button class="btn-confirm" (click)="confirm()">
        Confirmar pago — S/ {{ (total * 0.3) | number:'1.2-2' }}
      </button>
    </div>
  `,
  styles: [`
    .payment { display: flex; flex-direction: column; gap: var(--space-5); padding-bottom: var(--space-8); }
    .payment-summary { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-5); box-shadow: var(--shadow-sm); }
    .summary-amount { text-align: center; margin-bottom: var(--space-4); }
    .amount-label { display: block; font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-1); }
    .amount-value { font-size: var(--text-3xl); font-weight: 700; color: var(--color-primary); }
    .summary-detail { display: flex; flex-direction: column; gap: var(--space-2); }
    .detail-row { display: flex; justify-content: space-between; font-size: var(--text-sm); }
    .payment-methods h3, .payment-reference h3 { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-3); }
    .method-item { display: flex; align-items: center; gap: var(--space-3); padding: 16px; background: var(--color-surface); border-radius: var(--radius-md); border: 2px solid var(--color-border); cursor: pointer; transition: all var(--transition-fast); }
    .method-item.selected { border-color: var(--color-primary); background: var(--color-primary-light); }
    .method-item input { display: none; }
    .method-icon { font-size: 1.5rem; }
    .method-info { flex: 1; display: flex; flex-direction: column; }
    .method-name { font-weight: 600; font-size: var(--text-base); }
    .method-desc { font-size: var(--text-xs); color: var(--color-text-secondary); }
    .method-check { color: var(--color-primary); font-weight: 700; font-size: var(--text-lg); opacity: 0; }
    .method-item.selected .method-check { opacity: 1; }
    .bank-info { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); background: var(--color-background-alt); border-radius: var(--radius-md); }
    .bank-row { display: flex; justify-content: space-between; font-size: var(--text-sm); }
    .bank-label { color: var(--color-text-secondary); }
    .bank-value { font-weight: 500; }
    .btn-confirm { width: 100%; padding: 16px; background: var(--color-success); color: white; border: none; border-radius: var(--radius-md); font-size: var(--text-lg); font-weight: 600; cursor: pointer; font-family: var(--font-family); }
  `]
})
export class MobilePaymentComponent implements OnInit {
  total = 0;
  metodo = 'yape';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => { this.total = +(p['total'] || 0); });
  }

  confirm(): void {
    this.router.navigate(['/m/reservar', this.route.snapshot.paramMap.get('id'), 'confirmacion'], {
      queryParams: { total: this.total, metodo: this.metodo }
    });
  }
}
