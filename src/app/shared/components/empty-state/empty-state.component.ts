import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <span class="empty-icon">{{ icon }}</span>
      <h3 class="empty-title" *ngIf="title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <button class="empty-action" *ngIf="actionLabel" (click)="onAction.emit()">
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state { text-align: center; padding: var(--space-10); }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: var(--space-3); }
    .empty-title { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-2); color: var(--color-text-primary); }
    .empty-message { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }
    .empty-action { margin-top: var(--space-4); padding: 10px 24px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: 600; cursor: pointer; font-family: var(--font-family); }
  `]
})
export class EmptyStateComponent {
  @Input() icon = '📋';
  @Input() title = '';
  @Input() message = 'No hay elementos para mostrar';
  @Input() actionLabel = '';
  @Output() onAction = new EventEmitter<void>();
}
