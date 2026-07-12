import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <h1>{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</h1>
      </div>

      <div class="card form-card">
        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" [(ngModel)]="model.nombre" name="nombre" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Celular *</label>
            <input type="tel" [(ngModel)]="model.celular" name="celular" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="model.email" name="email" class="form-input" />
          </div>

          <div class="form-group">
            <label>Documento de Identidad</label>
            <input type="text" [(ngModel)]="model.documentoIdentidad" name="documento" class="form-input" />
          </div>

          <div class="form-group">
            <label>Dirección</label>
            <input type="text" [(ngModel)]="model.direccion" name="direccion" class="form-input" />
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/clientes" class="btn-secondary">Cancelar</button>
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
export class ClientFormComponent implements OnInit {
  isEdit = false;
  clientId?: number;
  model: Client = {
    nombre: '',
    celular: '',
    email: '',
    documentoIdentidad: '',
    direccion: '',
  };

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clientId = +id;
      this.clientService.findById(+id).subscribe((c) => {
        this.model = c;
      });
    }
  }

  onSubmit(): void {
    if (this.isEdit && this.clientId) {
      this.clientService.update(this.clientId, this.model).subscribe(() => {
        this.router.navigate(['/clientes']);
      });
    } else {
      this.clientService.create(this.model).subscribe(() => {
        this.router.navigate(['/clientes']);
      });
    }
  }
}
