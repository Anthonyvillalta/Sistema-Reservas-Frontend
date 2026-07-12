import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnvironmentService } from '../../core/services/environment.service';
import { Environment } from '../../models/environment.model';

@Component({
  selector: 'app-environment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>{{ isEdit ? 'Editar Ambiente' : 'Nuevo Ambiente' }}</h1>
      </div>

      <div class="card form-card">
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" [(ngModel)]="model.nombre" name="nombre" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Tipo *</label>
            <select [(ngModel)]="model.tipo" name="tipo" required class="form-input">
              <option value="EVENTO">Por Evento</option>
              <option value="HORAS">Por Horas</option>
            </select>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea [(ngModel)]="model.descripcion" name="descripcion" class="form-input" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Precio Base (S/) *</label>
            <input type="number" step="0.01" [(ngModel)]="model.precioBase" name="precioBase" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Capacidad Máxima</label>
            <input type="number" [(ngModel)]="model.capacidadMaxima" name="capacidad" class="form-input" />
          </div>

          <div class="form-group">
            <label>Estado</label>
            <select [(ngModel)]="model.estado" name="estado" class="form-input">
              <option value="ACTIVO">Activo</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/ambientes" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="!form.valid">
              {{ isEdit ? 'Actualizar' : 'Guardar' }}
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
    textarea.form-input { resize: vertical; }
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
export class EnvironmentFormComponent implements OnInit {
  isEdit = false;
  envId?: number;
  model: Environment = {
    nombre: '',
    tipo: 'EVENTO',
    descripcion: '',
    precioBase: 0,
    capacidadMaxima: undefined,
    estado: 'ACTIVO',
  };

  constructor(
    private environmentService: EnvironmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.envId = +id;
      this.environmentService.findById(+id).subscribe((e) => {
        this.model = e;
      });
    }
  }

  onSubmit(): void {
    if (this.isEdit && this.envId) {
      this.environmentService.update(this.envId, this.model).subscribe(() => {
        this.router.navigate(['/ambientes']);
      });
    } else {
      this.environmentService.create(this.model).subscribe(() => {
        this.router.navigate(['/ambientes']);
      });
    }
  }
}
