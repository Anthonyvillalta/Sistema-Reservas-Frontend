import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnvironmentService } from '../../../core/services/environment.service';
import { Environment } from '../../../models/environment.model';

@Component({
  selector: 'app-environment-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail" *ngIf="env">
      <div class="detail-image" [style.background]="getEnvColor(env.nombre)">
        <span class="detail-image-icon">{{ getEnvIcon(env.nombre) }}</span>
      </div>

      <div class="detail-body">
        <h1 class="detail-name">{{ env.nombre }}</h1>
        <span class="detail-status" [class.available]="env.estado === 'ACTIVO'">
          {{ env.estado === 'ACTIVO' ? 'Disponible' : 'En mantenimiento' }}
        </span>

        <div class="detail-info-grid">
          <div class="info-item">
            <span class="info-label">Precio</span>
            <span class="info-value price">S/ {{ env.precioBase | number:'1.2-2' }}</span>
          </div>
          <div class="info-item" *ngIf="env.capacidadMaxima">
            <span class="info-label">Capacidad</span>
            <span class="info-value">{{ env.capacidadMaxima }} personas</span>
          </div>
          <div class="info-item">
            <span class="info-label">Tipo</span>
            <span class="info-value">{{ env.tipo === 'EVENTO' ? 'Por evento' : 'Por horas' }}</span>
          </div>
        </div>

        <div class="detail-description" *ngIf="env.descripcion">
          <h3>Descripción</h3>
          <p>{{ env.descripcion }}</p>
        </div>

        <div class="detail-services">
          <h3>Servicios incluidos</h3>
          <div class="services-list">
            <span class="service-chip">✅ Estacionamiento</span>
            <span class="service-chip">✅ Seguridad</span>
            <span class="service-chip">✅ Iluminación</span>
            <span class="service-chip">✅ Baños</span>
          </div>
        </div>

        <button class="btn-reserve" (click)="reserve()" [disabled]="env.estado !== 'ACTIVO'">
          Reservar ahora
        </button>
      </div>
    </div>

    <div class="loading" *ngIf="!env">
      <div class="shimmer-full"></div>
    </div>
  `,
  styles: [`
    .detail { padding-bottom: var(--space-8); }
    .detail-image { height: 220px; display: flex; align-items: center; justify-content: center; font-size: 4rem; margin: 0 calc(-1 * var(--space-4)); }
    .detail-body { margin-top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-4); }
    .detail-name { font-size: var(--text-2xl); font-weight: 700; }
    .detail-status { font-size: var(--text-sm); font-weight: 600; }
    .detail-status.available { color: var(--color-success); }
    .detail-status:not(.available) { color: var(--color-warning); }
    .detail-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
    .info-item { display: flex; flex-direction: column; gap: 2px; }
    .info-label { font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; }
    .info-value { font-weight: 600; font-size: var(--text-base); }
    .info-value.price { color: var(--color-primary); font-size: var(--text-xl); font-weight: 700; }
    .detail-description h3, .detail-services h3 { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-2); }
    .detail-description p { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6; }
    .services-list { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .service-chip { padding: 6px 12px; background: var(--color-background-alt); border-radius: var(--radius-full); font-size: var(--text-sm); }
    .btn-reserve {
      width: 100%; padding: 16px; background: var(--color-primary); color: white;
      border: none; border-radius: var(--radius-md); font-size: var(--text-lg);
      font-weight: 600; cursor: pointer; font-family: var(--font-family);
      margin-top: var(--space-2);
    }
    .btn-reserve:disabled { background: var(--color-border); color: var(--color-text-tertiary); cursor: not-allowed; }
    .loading { padding: var(--space-4); }
    .shimmer-full { height: 500px; border-radius: var(--radius-lg); animation: shimmer 1.5s infinite; background: linear-gradient(90deg, var(--color-background-alt) 25%, var(--color-border) 50%, var(--color-background-alt) 75%); background-size: 200% 100%; }
  `]
})
export class EnvironmentDetailComponent implements OnInit {
  env?: Environment;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private envService: EnvironmentService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.envService.findById(id).subscribe({ next: (data) => { this.env = data; } });
  }

  reserve(): void {
    if (this.env?.id) this.router.navigate(['/m/reservar', this.env.id, 'fecha']);
  }

  getEnvColor(name: string): string {
    const colors: Record<string, string> = {
      'Piscina': 'linear-gradient(135deg, #2563EB, #3B82F6)',
      'Salón Principal': 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
      'Área Verde': 'linear-gradient(135deg, #059669, #10B981)',
      'Cancha de Grass': 'linear-gradient(135deg, #D97706, #F59E0B)',
    };
    return colors[name] || 'linear-gradient(135deg, #1D4ED8, #2563EB)';
  }

  getEnvIcon(name: string): string {
    const icons: Record<string, string> = { 'Piscina': '🏊', 'Salón Principal': '🏛️', 'Área Verde': '🌳', 'Cancha de Grass': '⚽' };
    return icons[name] || '📍';
  }
}
