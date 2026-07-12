import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a class="quick-action-card" [routerLink]="route" [style.--card-color]="color">
      <div class="quick-action-icon">
        <span class="material-icons">{{ icon }}</span>
      </div>
      <span class="quick-action-label">{{ label }}</span>
    </a>
  `,
  styles: [`
    .quick-action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 6px;
      background: #FFFFFF;
      border-radius: 18px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
      text-decoration: none;
      color: #0F172A;
      transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 150ms ease;
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.02);
      width: 100%;
      min-height: 88px;
      box-sizing: border-box;
      min-width: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .quick-action-card:active {
      transform: scale(0.93);
      background: #F8FAFC;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .quick-action-icon {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--card-color) 15%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 200ms ease;
    }
    .quick-action-card:active .quick-action-icon {
      transform: scale(1.08);
    }
    .quick-action-icon .material-icons {
      font-size: 22px;
      color: var(--card-color);
    }
    .quick-action-label {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      text-align: center;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class QuickActionCardComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() route!: string;
  @Input() color!: string;
}
