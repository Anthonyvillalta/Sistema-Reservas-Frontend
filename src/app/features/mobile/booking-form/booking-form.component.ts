import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnvironmentService } from '../../../core/services/environment.service';
import { Environment } from '../../../models/environment.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking" *ngIf="env">
      <div class="booking-summary">
        <div class="summary-row">
          <span class="summary-label">Ambiente</span>
          <span class="summary-value">{{ env.nombre }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Fecha</span>
          <span class="summary-value">{{ fecha }}</span>
        </div>
        <div class="summary-row" *ngIf="hora">
          <span class="summary-label">Hora</span>
          <span class="summary-value">{{ hora }}</span>
        </div>
      </div>

      <div class="form-section">
        <h3>Tus datos</h3>
        <div class="field">
          <label class="field-label">Nombre completo *</label>
          <input type="text" [(ngModel)]="nombre" class="field-input" placeholder="Tu nombre" />
        </div>
        <div class="field">
          <label class="field-label">Celular *</label>
          <input type="tel" [(ngModel)]="celular" class="field-input" placeholder="999 999 999" />
        </div>
        <div class="field">
          <label class="field-label">Email</label>
          <input type="email" [(ngModel)]="email" class="field-input" placeholder="tu@correo.com" />
        </div>
        <div class="field">
          <label class="field-label">Cantidad de personas</label>
          <input type="number" [(ngModel)]="personas" class="field-input" placeholder="1" min="1" />
        </div>
      </div>

      <div class="form-section">
        <h3>Servicios adicionales</h3>
        <div class="checkbox-group">
          <label class="checkbox-item">
            <input type="checkbox" [(ngModel)]="servicios.parrilla" />
            <span>Parrilla — S/ 50.00</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" [(ngModel)]="servicios.sonido" />
            <span>Sonido — S/ 80.00</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" [(ngModel)]="servicios.decoracion" />
            <span>Decoración — S/ 120.00</span>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h3>Resumen</h3>
        <div class="price-breakdown">
          <div class="price-row"><span>Subtotal ({{ env.nombre }})</span><span>S/ {{ env.precioBase | number:'1.2-2' }}</span></div>
          <div class="price-row" *ngIf="servicios.parrilla"><span>Parrilla</span><span>S/ 50.00</span></div>
          <div class="price-row" *ngIf="servicios.sonido"><span>Sonido</span><span>S/ 80.00</span></div>
          <div class="price-row" *ngIf="servicios.decoracion"><span>Decoración</span><span>S/ 120.00</span></div>
          <div class="price-divider"></div>
          <div class="price-row total"><span>Total</span><span>S/ {{ total | number:'1.2-2' }}</span></div>
          <div class="price-row advance"><span>Adelanto (30%)</span><span>S/ {{ (total * 0.3) | number:'1.2-2' }}</span></div>
          <div class="price-row balance"><span>Saldo pendiente</span><span>S/ {{ (total * 0.7) | number:'1.2-2' }}</span></div>
        </div>
      </div>

      <button class="btn-pay" (click)="goToPayment()" [disabled]="!nombre || !celular">
        Ir a pagar — S/ {{ (total * 0.3) | number:'1.2-2' }}
      </button>
    </div>
  `,
  styles: [`
    .booking { display: flex; flex-direction: column; gap: var(--space-5); padding-bottom: var(--space-8); }
    .booking-summary { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-4); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: var(--space-2); }
    .summary-row { display: flex; justify-content: space-between; font-size: var(--text-sm); }
    .summary-label { color: var(--color-text-secondary); }
    .summary-value { font-weight: 600; }
    .form-section { display: flex; flex-direction: column; gap: var(--space-3); }
    .form-section h3 { font-size: var(--text-lg); font-weight: 600; }
    .field { display: flex; flex-direction: column; gap: var(--space-1); }
    .field-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-text-primary); }
    .field-input { width: 100%; padding: 14px 16px; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--text-base); font-family: var(--font-family); outline: none; background: var(--color-surface); transition: border-color var(--transition-fast); }
    .field-input:focus { border-color: var(--color-primary); }
    .checkbox-group { display: flex; flex-direction: column; gap: var(--space-2); }
    .checkbox-item { display: flex; align-items: center; gap: var(--space-3); padding: 12px; background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border); cursor: pointer; }
    .checkbox-item input { width: 20px; height: 20px; accent-color: var(--color-primary); }
    .checkbox-item span { font-size: var(--text-sm); }
    .price-breakdown { background: var(--color-surface); border-radius: var(--radius-md); padding: var(--space-4); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: var(--space-2); }
    .price-row { display: flex; justify-content: space-between; font-size: var(--text-sm); }
    .price-divider { height: 1px; background: var(--color-border); margin: var(--space-2) 0; }
    .price-row.total { font-size: var(--text-lg); font-weight: 700; color: var(--color-primary); }
    .price-row.advance { color: var(--color-warning); font-weight: 600; }
    .price-row.balance { color: var(--color-text-secondary); }
    .btn-pay { width: 100%; padding: 16px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: var(--text-lg); font-weight: 600; cursor: pointer; font-family: var(--font-family); }
    .btn-pay:disabled { background: var(--color-border); color: var(--color-text-tertiary); cursor: not-allowed; }
  `]
})
export class BookingFormComponent implements OnInit {
  env?: Environment;
  envId = 0;
  fecha = '';
  hora = '';
  nombre = '';
  celular = '';
  email = '';
  personas = 1;

  servicios = { parrilla: false, sonido: false, decoracion: false };

  get total(): number {
    let t = this.env?.precioBase || 0;
    if (this.servicios.parrilla) t += 50;
    if (this.servicios.sonido) t += 80;
    if (this.servicios.decoracion) t += 120;
    return t;
  }

  constructor(
    private route: ActivatedRoute, private router: Router,
    private envService: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.envId = +this.route.snapshot.paramMap.get('id')!;
    this.route.queryParams.subscribe(p => {
      this.fecha = p['fecha'] || '';
      this.hora = p['hora'] || '';
    });
    this.envService.findById(this.envId).subscribe({ next: (data) => { this.env = data; } });
  }

  goToPayment(): void {
    this.router.navigate(['/m/reservar', this.envId, 'pago'], {
      queryParams: {
        fecha: this.fecha, hora: this.hora,
        nombre: this.nombre, celular: this.celular, email: this.email,
        personas: this.personas, total: this.total
      }
    });
  }
}
