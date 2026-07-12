import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../core/services/reservation.service';
import { ClientService } from '../../core/services/client.service';
import { EnvironmentService } from '../../core/services/environment.service';
import { Reservation, Disponibilidad } from '../../models/reservation.model';
import { Client } from '../../models/client.model';
import { Environment } from '../../models/environment.model';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>Nueva Reserva</h1>
      </div>

      <div class="card form-card">
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <!-- Paso 1: Cliente -->
          <div class="form-group">
            <label>Cliente *</label>
            <select [(ngModel)]="model.clientId" name="clientId" required class="form-input" (change)="checkDisponibilidad()">
              <option value="">Seleccionar cliente...</option>
              <option *ngFor="let c of clients" [value]="c.id">{{ c.nombre }} - {{ c.celular }}</option>
            </select>
          </div>

          <!-- Paso 2: Ambiente -->
          <div class="form-group">
            <label>Ambiente *</label>
            <select [(ngModel)]="model.environmentId" name="environmentId" required class="form-input" (change)="onEnvironmentChange()">
              <option value="">Seleccionar ambiente...</option>
              <option *ngFor="let e of environments" [value]="e.id">
                {{ e.nombre }} - S/ {{ e.precioBase.toFixed(2) }} ({{ e.tipo === 'EVENTO' ? 'Evento' : 'Por hora' }})
              </option>
            </select>
          </div>

          <!-- Paso 3: Fecha -->
          <div class="form-group">
            <label>Fecha del Evento *</label>
            <input type="date" [(ngModel)]="model.fechaEvento" name="fechaEvento" required class="form-input" (change)="checkDisponibilidad()" />
          </div>

          <!-- Horas (solo para tipo HORAS) -->
          <div class="form-row" *ngIf="selectedEnv?.tipo === 'HORAS'">
            <div class="form-group">
              <label>Hora Inicio *</label>
              <input type="time" [(ngModel)]="model.horaInicio" name="horaInicio" class="form-input" (change)="calcularPrecio()" />
            </div>
            <div class="form-group">
              <label>Hora Fin *</label>
              <input type="time" [(ngModel)]="model.horaFin" name="horaFin" class="form-input" (change)="calcularPrecio()" />
            </div>
          </div>

          <!-- Disponibilidad -->
          <div class="disponibilidad" *ngIf="disponibilidad">
            <div class="disp-icon" [class.disp-ok]="disponibilidad.disponible" [class.disp-no]="!disponibilidad.disponible">
              {{ disponibilidad.disponible ? '✅' : '❌' }}
            </div>
            <div class="disp-info">
              <strong>{{ disponibilidad.mensaje }}</strong>
              <span *ngIf="disponibilidad.horariosOcupados.length > 0" class="disp-ocupados">
                Ocupado: {{ disponibilidad.horariosOcupados.join(', ') }}
              </span>
            </div>
          </div>

          <!-- Precio -->
          <div class="form-group">
            <label>Precio Total (S/) *</label>
            <input type="number" step="0.01" [(ngModel)]="model.precioTotal" name="precioTotal" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Notas</label>
            <textarea [(ngModel)]="model.notas" name="notas" class="form-input" rows="3"></textarea>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" [(ngModel)]="adelantoRequerido" name="adelanto" />
              Requiere adelanto
            </label>
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/reservas" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="!form.valid || !disponibilidad?.disponible">
              Crear Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card { max-width: 600px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; }
    .form-input {
      width: 100%;
      padding: 10px 14px;
      border: 2px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
    }
    .form-input:focus { border-color: var(--primary); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .disponibilidad {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      background: var(--background);
    }
    .disp-icon { font-size: 1.5rem; }
    .disp-info { display: flex; flex-direction: column; }
    .disp-ocupados { font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px; }
    .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .btn-primary, .btn-secondary {
      padding: 10px 24px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: none;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:disabled { opacity: 0.6; }
    .btn-secondary { background: var(--background); color: var(--text-primary); border: 1px solid var(--border); text-decoration: none; }
  `],
})
export class ReservationFormComponent implements OnInit {
  clients: Client[] = [];
  environments: Environment[] = [];
  selectedEnv?: Environment;
  disponibilidad?: Disponibilidad;
  adelantoRequerido = false;

  model: Reservation = {
    clientId: 0,
    environmentId: 0,
    fechaEvento: '',
    horaInicio: undefined,
    horaFin: undefined,
    precioTotal: 0,
    notas: '',
  };

  constructor(
    private reservationService: ReservationService,
    private clientService: ClientService,
    private environmentService: EnvironmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.findAll().subscribe((data) => (this.clients = data));
    this.environmentService.findAll().subscribe((data) => (this.environments = data));
  }

  onEnvironmentChange(): void {
    this.selectedEnv = this.environments.find((e) => e.id === this.model.environmentId);
    if (this.selectedEnv) {
      this.model.precioTotal = this.selectedEnv.precioBase;
    }
    this.checkDisponibilidad();
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
    if (this.selectedEnv?.tipo === 'HORAS' && this.model.horaInicio && this.model.horaFin) {
      const [h1, m1] = this.model.horaInicio.split(':').map(Number);
      const [h2, m2] = this.model.horaFin.split(':').map(Number);
      const horas = Math.max(1, (h2 * 60 + m2 - (h1 * 60 + m1)) / 60);
      this.model.precioTotal = this.selectedEnv.precioBase * horas;
    }
  }

  onSubmit(): void {
    this.model.adelantoRequerido = this.adelantoRequerido;

    this.reservationService.create(this.model).subscribe({
      next: (res) => {
        this.router.navigate(['/reservas', res.id]);
      },
      error: (err) => {
        alert(err.error?.mensaje || 'Error al crear la reserva');
      },
    });
  }
}
