import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="isLoading">
      <div class="loading-spinner"></div>
      <span class="loading-text" *ngIf="text">{{ text }}</span>
    </div>
  `,
  styles: [`
    .loading-overlay {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: var(--space-3); padding: var(--space-8);
    }
    .loading-spinner {
      width: 36px; height: 36px; border: 3px solid var(--color-border);
      border-top-color: var(--color-primary); border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .loading-text { font-size: var(--text-sm); color: var(--color-text-secondary); }
  `]
})
export class LoadingOverlayComponent {
  @Input() isLoading = false;
  @Input() text = 'Cargando...';
}
