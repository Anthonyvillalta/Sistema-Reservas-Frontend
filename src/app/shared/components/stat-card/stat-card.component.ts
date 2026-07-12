import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-icon" [style.--stat-color]="color">
        <span class="material-icons">{{ icon }}</span>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ value }}</span>
        <span class="stat-label">{{ label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      gap: 10px;
      padding: 16px 14px;
      background: #FFFFFF;
      border-radius: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
      min-height: 96px;
      width: 100%;
      box-sizing: border-box;
      min-width: 0;
      border: 1px solid rgba(0,0,0,0.02);
      transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 150ms ease;
    }
    .stat-card:active {
      transform: scale(0.97);
    }
    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--stat-color) 15%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon .material-icons {
      font-size: 20px;
      color: var(--stat-color);
    }
    .stat-info {
      width: 100%;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .stat-label {
      font-size: 10px;
      color: #94A3B8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `]
})
export class StatCardComponent {
  @Input() icon!: string;
  @Input() value!: string;
  @Input() label!: string;
  @Input() color!: string;
}
