import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div class="page-header-left">
        <button class="back-btn" *ngIf="showBack" (click)="onBack.emit()">
          <span class="material-icons">arrow_back</span>
        </button>
        <h1 class="page-title">{{ title }}</h1>
      </div>
      <div class="page-header-right">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-3);
    }
    .page-header-left { display: flex; align-items: center; gap: var(--space-3); }
    .page-title { font-size: var(--text-2xl); font-weight: 700; color: var(--color-text-primary); margin: 0; }
    .page-header-right { display: flex; align-items: center; gap: var(--space-2); }
    .back-btn { background: none; border: none; cursor: pointer; padding: var(--space-2); border-radius: var(--radius-sm); color: var(--color-text-primary); }
    .back-btn:hover { background: var(--color-background-alt); }

    @media (max-width: 768px) {
      .page-title { font-size: var(--text-xl); }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() showBack = false;
  @Output() onBack = new EventEmitter<void>();
}
