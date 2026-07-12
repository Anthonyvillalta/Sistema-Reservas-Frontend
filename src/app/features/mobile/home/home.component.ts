import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { EnvironmentService } from '../../../core/services/environment.service';
import { Environment } from '../../../models/environment.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home">
      <div class="home-greeting">
        <h2 class="greeting-text">Hola {{ userName }} 👋</h2>
        <p class="greeting-sub">¿Qué espacio deseas reservar?</p>
      </div>

      <div class="environments-list">
        <div *ngFor="let env of environments" class="env-card" (click)="goToDetail(env)">
          <div class="env-card-image" [style.background]="getEnvColor(env.nombre)">
            <span class="env-card-icon">{{ getEnvIcon(env.nombre) }}</span>
          </div>
          <div class="env-card-body">
            <h3 class="env-card-name">{{ env.nombre }}</h3>
            <div class="env-card-meta">
              <span class="env-card-price">S/ {{ env.precioBase | number:'1.2-2' }}</span>
              <span class="env-card-type">{{ env.tipo === 'EVENTO' ? 'Por evento' : 'Por hora' }}</span>
            </div>
            <span class="env-card-status" [class.available]="env.estado === 'ACTIVO'">
              {{ env.estado === 'ACTIVO' ? 'Disponible' : 'En mantenimiento' }}
            </span>
          </div>
          <button class="env-card-btn" [disabled]="env.estado !== 'ACTIVO'">Reservar</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-shimmer">
        <div *ngFor="let _ of [1,2,3,4]" class="shimmer-card"></div>
      </div>
    </div>
  `,
  styles: [`
    .home { padding-bottom: var(--space-4); }
    .home-greeting { margin-bottom: var(--space-6); }
    .greeting-text { font-size: var(--text-2xl); font-weight: 700; color: var(--color-text-primary); }
    .greeting-sub { font-size: var(--text-base); color: var(--color-text-secondary); margin-top: var(--space-1); }
    .environments-list { display: flex; flex-direction: column; gap: var(--space-4); }
    .env-card {
      display: flex; flex-direction: column; gap: var(--space-3); padding: var(--space-4);
      background: var(--color-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
      cursor: pointer; transition: transform var(--transition-fast), box-shadow var(--transition-fast);
    }
    .env-card:active { transform: scale(0.98); }
    .env-card-image {
      height: 140px; border-radius: var(--radius-md); display: flex;
      align-items: center; justify-content: center; font-size: 3rem;
    }
    .env-card-body { display: flex; flex-direction: column; gap: var(--space-1); }
    .env-card-name { font-size: var(--text-lg); font-weight: 600; }
    .env-card-meta { display: flex; justify-content: space-between; align-items: center; }
    .env-card-price { font-size: var(--text-xl); font-weight: 700; color: var(--color-primary); }
    .env-card-type { font-size: var(--text-xs); color: var(--color-text-tertiary); text-transform: uppercase; }
    .env-card-status { font-size: var(--text-xs); font-weight: 600; }
    .env-card-status.available { color: var(--color-success); }
    .env-card-status:not(.available) { color: var(--color-warning); }
    .env-card-btn {
      width: 100%; padding: 12px; background: var(--color-primary); color: white;
      border: none; border-radius: var(--radius-md); font-size: var(--text-base);
      font-weight: 600; cursor: pointer; font-family: var(--font-family);
    }
    .env-card-btn:disabled { background: var(--color-border); color: var(--color-text-tertiary); cursor: not-allowed; }
    .loading-shimmer { display: flex; flex-direction: column; gap: var(--space-4); }
    .shimmer-card { height: 280px; border-radius: var(--radius-lg); animation: shimmer 1.5s infinite; background: linear-gradient(90deg, var(--color-background-alt) 25%, var(--color-border) 50%, var(--color-background-alt) 75%); background-size: 200% 100%; }
  `]
})
export class HomeComponent implements OnInit {
  environments: Environment[] = [];
  userName = '';
  loading = true;

  constructor(
    private envService: EnvironmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getCurrentUser()?.nombreCompleto?.split(' ')[0] || 'Invitado';
    this.envService.findAll().subscribe({
      next: (data) => { this.environments = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  goToDetail(env: Environment): void {
    if (env.estado !== 'ACTIVO') return;
    this.router.navigate(['/m/ambientes', env.id]);
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
