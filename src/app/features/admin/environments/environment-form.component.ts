import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnvironmentService } from '../../../core/services/environment.service';
import { Environment } from '../../../models/environment.model';

@Component({
  selector: 'app-environment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="ef">
      <!-- Header -->
      <div class="ef-header">
        <button class="ef-back" (click)="cancel()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 class="ef-title">{{ isEdit ? 'Editar Ambiente' : 'Nuevo Ambiente' }}</h1>
          <p class="ef-subtitle">{{ isEdit ? 'Actualiza la información del espacio' : 'Registra un nuevo espacio disponible' }}</p>
        </div>
      </div>

      <!-- Hero banner -->
      <div class="ef-hero" [style.background]="heroGradient" *ngIf="!model.imagenUrl && !previewUrl">
        <span class="ef-hero-icon">{{ heroIcon }}</span>
        <div class="ef-hero-info">
          <h2 class="ef-hero-name">{{ model.nombre || 'Nombre del ambiente' }}</h2>
          <span class="ef-hero-badge" [class.badge-active]="model.estado === 'ACTIVO'" [class.badge-maint]="model.estado !== 'ACTIVO'">
            <span class="ef-hero-dot" [class.dot-on]="model.estado === 'ACTIVO'" [class.dot-off]="model.estado !== 'ACTIVO'"></span>
            {{ model.estado === 'ACTIVO' ? 'Disponible' : 'Mantenimiento' }}
          </span>
        </div>
      </div>
      <!-- Hero with image -->
      <div class="ef-hero ef-hero--img" *ngIf="model.imagenUrl || previewUrl">
        <img [src]="previewUrl || model.imagenUrl" class="ef-hero-img" />
        <div class="ef-hero-overlay">
          <div class="ef-hero-info">
            <h2 class="ef-hero-name">{{ model.nombre || 'Nombre del ambiente' }}</h2>
            <span class="ef-hero-badge" [class.badge-active]="model.estado === 'ACTIVO'" [class.badge-maint]="model.estado !== 'ACTIVO'">
              <span class="ef-hero-dot" [class.dot-on]="model.estado === 'ACTIVO'" [class.dot-off]="model.estado !== 'ACTIVO'"></span>
              {{ model.estado === 'ACTIVO' ? 'Disponible' : 'Mantenimiento' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Form card -->
      <div class="ef-card">
        <form (ngSubmit)="onSubmit()" #form="ngForm">

          <!-- Photo -->
          <div class="ef-section">
            <h3 class="ef-section-title">Foto del ambiente</h3>
            <div class="ef-photo" (click)="photoInput.click()">
              <input #photoInput type="file" accept="image/*" class="ef-photo-input" (change)="onPhotoSelected($event)" />
              <div *ngIf="!previewUrl && !model.imagenUrl" class="ef-photo-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span class="ef-photo-text">Tocar para agregar foto</span>
              </div>
              <div *ngIf="previewUrl || model.imagenUrl" class="ef-photo-preview">
                <img [src]="previewUrl || model.imagenUrl" class="ef-photo-img" />
                <button type="button" class="ef-photo-remove" (click)="$event.stopPropagation(); removePhoto()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div class="ef-photo-or">o</div>
            <div class="ef-input-wrap">
              <svg class="ef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <input type="url" [(ngModel)]="model.imagenUrl" name="imagenUrl" class="ef-input" placeholder="O pega una URL de imagen..." (input)="onUrlChange()" autocomplete="off" />
            </div>
          </div>

          <div class="ef-divider"></div>

          <!-- Section 1 -->
          <div class="ef-section">
            <h3 class="ef-section-title">Información del ambiente</h3>

            <div class="ef-field">
              <label class="ef-label">Nombre del ambiente *</label>
              <div class="ef-input-wrap">
                <svg class="ef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <input type="text" [(ngModel)]="model.nombre" name="nombre" required class="ef-input" placeholder="Ej: Piscina + Salón" autocomplete="off" />
              </div>
            </div>

            <div class="ef-field">
              <label class="ef-label">Tipo de alquiler *</label>
              <div class="ef-input-wrap">
                <svg class="ef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <select [(ngModel)]="model.tipo" name="tipo" required class="ef-input ef-select">
                  <option value="EVENTO">Por Evento</option>
                  <option value="HORAS">Por Horas</option>
                </select>
              </div>
            </div>
          </div>

          <div class="ef-divider"></div>

          <!-- Section 2 -->
          <div class="ef-section">
            <h3 class="ef-section-title">Descripción</h3>
            <div class="ef-field">
              <label class="ef-label">Descripción del espacio</label>
              <textarea [(ngModel)]="model.descripcion" name="descripcion" class="ef-textarea" rows="3" placeholder="Describe las características del ambiente..."></textarea>
            </div>
          </div>

          <div class="ef-divider"></div>

          <!-- Section 3 -->
          <div class="ef-section">
            <h3 class="ef-section-title">Configuración</h3>

            <div class="ef-field">
              <label class="ef-label">Precio base *</label>
              <div class="ef-input-wrap">
                <span class="ef-input-prefix">S/</span>
                <input type="number" step="0.01" [(ngModel)]="model.precioBase" name="precioBase" required class="ef-input ef-input--price" placeholder="0.00" />
              </div>
            </div>

            <div class="ef-field">
              <label class="ef-label">Capacidad máxima</label>
              <div class="ef-input-wrap">
                <svg class="ef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <input type="number" [(ngModel)]="model.capacidadMaxima" name="capacidad" class="ef-input" placeholder="Ej: 100" />
              </div>
            </div>
          </div>

          <div class="ef-divider"></div>

          <!-- Section 4 -->
          <div class="ef-section">
            <h3 class="ef-section-title">Estado</h3>
            <div class="ef-radio-group">
              <label class="ef-radio" [class.ef-radio--active]="model.estado === 'ACTIVO'">
                <input type="radio" [(ngModel)]="model.estado" name="estado" value="ACTIVO" />
                <span class="ef-radio-circle"></span>
                <div>
                  <span class="ef-radio-label">Activo</span>
                  <span class="ef-radio-desc">El ambiente está disponible para reservas</span>
                </div>
              </label>
              <label class="ef-radio" [class.ef-radio--active]="model.estado === 'MANTENIMIENTO'">
                <input type="radio" [(ngModel)]="model.estado" name="estado" value="MANTENIMIENTO" />
                <span class="ef-radio-circle"></span>
                <div>
                  <span class="ef-radio-label">Mantenimiento</span>
                  <span class="ef-radio-desc">El ambiente no está disponible temporalmente</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="ef-actions">
            <button type="button" class="ef-btn ef-btn--secondary" (click)="cancel()">Cancelar</button>
            <button type="submit" class="ef-btn ef-btn--primary" [disabled]="!form.valid">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              {{ isEdit ? 'Guardar Ambiente' : 'Crear Ambiente' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .ef { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; animation: efFade 0.3s ease both; }
    @keyframes efFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    /* Header */
    .ef-header { display: flex; align-items: center; gap: 12px; }
    .ef-back { width: 40px; height: 40px; border: none; border-radius: 12px; background: #F1F5F9; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #0F172A; flex-shrink: 0; transition: background 0.2s; }
    .ef-back:hover { background: #E2E8F0; }
    .ef-back:active { transform: scale(0.92); }
    .ef-title { font-size: 20px; font-weight: 700; color: #1E293B; margin: 0; line-height: 1.2; }
    .ef-subtitle { font-size: 13px; color: #94A3B8; margin: 2px 0 0; }

    /* Hero */
    .ef-hero {
      display: flex; align-items: center; gap: 16px;
      padding: 20px; border-radius: 18px;
      color: #fff; position: relative; overflow: hidden;
      min-height: 80px;
    }
    .ef-hero--img { padding: 0; }
    .ef-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .ef-hero-overlay {
      position: relative; width: 100%; padding: 20px;
      background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%);
    }
    .ef-hero-icon { font-size: 2.8rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2)); flex-shrink: 0; }
    .ef-hero-info { display: flex; flex-direction: column; gap: 4px; }
    .ef-hero-name { font-size: 18px; font-weight: 700; margin: 0; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.15); }
    .ef-hero-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; width: fit-content; }
    .badge-active { background: rgba(16,185,129,0.25); color: #fff; }
    .badge-maint { background: rgba(245,158,11,0.25); color: #fff; }
    .ef-hero-dot { width: 6px; height: 6px; border-radius: 50%; }
    .dot-on { background: #34D399; box-shadow: 0 0 6px rgba(52,211,153,0.6); }
    .dot-off { background: #FBBF24; box-shadow: 0 0 6px rgba(251,191,36,0.6); }

    /* Card */
    .ef-card { background: #fff; border-radius: 20px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04); }

    /* Sections */
    .ef-section { display: flex; flex-direction: column; gap: 16px; }
    .ef-section-title { font-size: 13px; font-weight: 700; color: #1E293B; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .ef-divider { height: 1px; background: #E2E8F0; margin: 16px 0; }

    /* Fields */
    .ef-field { display: flex; flex-direction: column; gap: 6px; }
    .ef-label { font-size: 12px; font-weight: 600; color: #475569; }
    .ef-input-wrap { position: relative; display: flex; align-items: center; }
    .ef-input-icon { position: absolute; left: 14px; color: #94A3B8; pointer-events: none; z-index: 1; }
    .ef-input-prefix { position: absolute; left: 16px; font-size: 1rem; font-weight: 700; color: #0F172A; pointer-events: none; z-index: 1; }

    .ef-input {
      width: 100%; height: 50px; padding: 0 16px 0 42px;
      border: 2px solid #E2E8F0; border-radius: 14px;
      font-size: 15px; font-weight: 500; font-family: inherit;
      background: #F8FAFC; color: #0F172A; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .ef-input:focus {
      border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
      background: #fff;
    }
    .ef-input::placeholder { color: #94A3B8; font-weight: 400; }
    .ef-input--price { padding-left: 36px; font-size: 1.1rem; font-weight: 800; font-variant-numeric: tabular-nums; }
    .ef-select {
      -webkit-appearance: none; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
      padding-right: 36px; cursor: pointer;
    }

    /* Photo */
    .ef-photo { width: 100%; border-radius: 14px; border: 2px dashed #CBD5E1; cursor: pointer; overflow: hidden; transition: border-color 0.2s; }
    .ef-photo:hover { border-color: #2563EB; }
    .ef-photo-input { display: none; }
    .ef-photo-placeholder {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 28px 16px; color: #94A3B8;
    }
    .ef-photo-placeholder svg { color: #CBD5E1; }
    .ef-photo-text { font-size: 13px; font-weight: 500; }
    .ef-photo-preview { position: relative; width: 100%; }
    .ef-photo-img { width: 100%; height: 140px; object-fit: cover; display: block; }
    .ef-photo-remove {
      position: absolute; top: 8px; right: 8px;
      width: 30px; height: 30px; border-radius: 50%;
      background: rgba(0,0,0,0.5); border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #fff; transition: background 0.15s;
    }
    .ef-photo-remove:hover { background: rgba(0,0,0,0.7); }
    .ef-photo-or { text-align: center; font-size: 11px; color: #94A3B8; font-weight: 500; padding: 6px 0; }

    .ef-textarea {
      width: 100%; padding: 14px 16px;
      border: 2px solid #E2E8F0; border-radius: 14px;
      font-size: 15px; font-weight: 500; font-family: inherit;
      background: #F8FAFC; color: #0F172A; outline: none;
      transition: border-color 0.2s; resize: vertical; min-height: 80px;
      box-sizing: border-box;
    }
    .ef-textarea:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); background: #fff; }

    /* Radio group */
    .ef-radio-group { display: flex; flex-direction: column; gap: 8px; }
    .ef-radio {
      display: flex; align-items: center; gap: 12px;
      padding: 14px; border: 2px solid #E2E8F0; border-radius: 14px;
      cursor: pointer; transition: all 0.15s;
    }
    .ef-radio--active { border-color: #2563EB; background: rgba(37,99,235,0.04); }
    .ef-radio input { position: absolute; opacity: 0; }
    .ef-radio-circle {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid #CBD5E1; flex-shrink: 0;
      transition: all 0.15s; position: relative;
    }
    .ef-radio--active .ef-radio-circle { border-color: #2563EB; background: #2563EB; }
    .ef-radio--active .ef-radio-circle::after {
      content: ''; position: absolute; top: 5px; left: 5px;
      width: 6px; height: 6px; border-radius: 50%; background: #fff;
    }
    .ef-radio-label { font-size: 14px; font-weight: 600; color: #1E293B; display: block; }
    .ef-radio-desc { font-size: 11px; color: #94A3B8; margin-top: 1px; display: block; }

    /* Actions */
    .ef-actions { display: flex; gap: 10px; margin-top: 4px; }
    .ef-btn {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 16px 20px; border-radius: 14px;
      font-size: 15px; font-weight: 700; font-family: inherit;
      cursor: pointer; border: none; transition: all 0.2s; height: 52px;
    }
    .ef-btn:active { transform: scale(0.97); }
    .ef-btn--primary { background: #2563EB; color: #fff; box-shadow: 0 4px 14px rgba(37,99,235,0.3); }
    .ef-btn--primary:disabled { opacity: 0.4; transform: none; box-shadow: none; }
    .ef-btn--secondary { background: #F1F5F9; color: #0F172A; flex: 0.6; }

    @media (min-width: 769px) { .ef { padding: 24px 0; gap: 20px; } }
  `]
})
export class EnvironmentFormComponent implements OnInit {
  isEdit = false;
  envId?: number;
  model: Environment = { nombre: '', tipo: 'EVENTO', descripcion: '', precioBase: 0, capacidadMaxima: undefined, estado: 'ACTIVO' };
  previewUrl: string | null = null;

  private colorMap: Record<string, string> = {
    default: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
    Piscina: 'linear-gradient(135deg, #2563EB, #3B82F6)',
    'Salón Principal': 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
    'Área Verde': 'linear-gradient(135deg, #059669, #10B981)',
    'Cancha de Grass': 'linear-gradient(135deg, #D97706, #F59E0B)',
  };

  private iconMap: Record<string, string> = {
    Piscina: '🏊', 'Salón Principal': '🏛️', 'Área Verde': '🌳', 'Cancha de Grass': '⚽',
  };

  constructor(private envService: EnvironmentService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.envId = +id; this.envService.findById(+id).subscribe(e => this.model = e); }
  }

  get heroGradient(): string {
    return this.colorMap[this.model.nombre] || this.colorMap['default'];
  }

  get heroIcon(): string {
    return this.iconMap[this.model.nombre] || '📍';
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.model.imagenUrl = this.previewUrl;
    };
    reader.readAsDataURL(file);
  }

  onUrlChange(): void { this.previewUrl = null; }

  removePhoto(): void { this.previewUrl = null; this.model.imagenUrl = undefined; }

  onSubmit(): void {
    const obs = this.isEdit ? this.envService.update(this.envId!, this.model) : this.envService.create(this.model);
    obs.subscribe(() => this.router.navigate(['/ambientes']));
  }

  cancel(): void { this.router.navigate(['/ambientes']); }
}
