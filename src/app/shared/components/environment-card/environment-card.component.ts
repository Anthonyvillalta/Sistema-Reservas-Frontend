import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Environment } from '../../../models/environment.model';

@Component({
  selector: 'app-environment-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ec">
      <div class="ec-media" *ngIf="!environment.imagenUrl" [style.background]="gradient">
        <span class="ec-icon">{{ icon }}</span>
      </div>
      <div class="ec-media ec-media--img" *ngIf="environment.imagenUrl">
        <img [src]="environment.imagenUrl" class="ec-img" />
      </div>
      <div class="ec-body">
        <div class="ec-row">
          <h3 class="ec-name">{{ environment.nombre }}</h3>
          <span class="ec-badge" [class.ec-badge--ok]="environment.estado === 'ACTIVO'" [class.ec-badge--warn]="environment.estado !== 'ACTIVO'">
            <span class="ec-dot" [class.dot-ok]="environment.estado === 'ACTIVO'" [class.dot-warn]="environment.estado !== 'ACTIVO'"></span>
            {{ environment.estado === 'ACTIVO' ? 'Disponible' : 'Mantenimiento' }}
          </span>
        </div>
        <div class="ec-row ec-row--meta">
          <span class="ec-price">S/ {{ environment.precioBase | number:'1.2-2' }}</span>
          <span class="ec-type">{{ environment.tipo === 'EVENTO' ? 'Por evento' : 'Por hora' }}</span>
        </div>
        <div class="ec-row ec-row--capacity" *ngIf="environment.capacidadMaxima">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span>{{ environment.capacidadMaxima }} personas</span>
        </div>
      </div>
      <div class="ec-actions" *ngIf="!hideActions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .ec {
      background: #fff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
      transition: all 0.15s;
    }
    .ec:active { transform: scale(0.98); }
    .ec-media {
      height: 90px;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.2rem;
      position: relative;
      overflow: hidden;
    }
    .ec-media--img { background: #F1F5F9; }
    .ec-img { width: 100%; height: 100%; object-fit: cover; }
    .ec-icon { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); }
    .ec-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; }
    .ec-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .ec-row--meta { }
    .ec-row--capacity { justify-content: flex-start; gap: 4px; font-size: 12px; color: #64748B; font-weight: 500; }
    .ec-row--capacity svg { color: #94A3B8; flex-shrink: 0; }
    .ec-name { font-size: 15px; font-weight: 700; color: #1E293B; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ec-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; flex-shrink: 0; }
    .ec-badge--ok { background: #D1FAE5; color: #059669; }
    .ec-badge--warn { background: #FEF3C7; color: #D97706; }
    .ec-dot { width: 6px; height: 6px; border-radius: 50%; }
    .dot-ok { background: #10B981; }
    .dot-warn { background: #F59E0B; }
    .ec-price { font-size: 17px; font-weight: 800; color: #1E293B; font-variant-numeric: tabular-nums; }
    .ec-type { font-size: 10px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.3px; }
    .ec-actions { display: flex; gap: 8px; padding: 0 14px 12px; }
    .ec-actions ::ng-deep .btn-outline {
      flex: 1; padding: 8px; border: 1px solid #E2E8F0; border-radius: 10px;
      background: #F8FAFC; cursor: pointer; font-family: inherit;
      font-size: 11px; font-weight: 600; color: #475569; text-align: center;
      text-decoration: none; transition: all 0.1s;
    }
    .ec-actions ::ng-deep .btn-outline:active { background: #F1F5F9; transform: scale(0.96); }
  `]
})
export class EnvironmentCardComponent {
  @Input() environment!: Environment;
  @Input() mode: 'grid' | 'list' = 'grid';
  @Input() hideActions = false;
  @Output() onClick = new EventEmitter<void>();

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

  get gradient(): string { return this.colorMap[this.environment.nombre] || this.colorMap['default']; }
  get icon(): string { return this.iconMap[this.environment.nombre] || '📍'; }
}