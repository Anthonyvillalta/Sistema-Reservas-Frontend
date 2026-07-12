import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bottom-nav" role="navigation" aria-label="Navegación principal">
      <button *ngFor="let tab of tabs"
              class="bottom-nav-item"
              [class.bottom-nav-item--active]="isActive(tab.route)"
              [class.bottom-nav-item--center]="tab.highlight"
              (click)="navigate(tab.route)"
              type="button"
              [attr.aria-current]="isActive(tab.route) ? 'page' : null"
              [attr.aria-label]="tab.label">
        <span class="material-icons-outlined material-icons">{{ tab.icon }}</span>
        <span class="bottom-nav-label">{{ tab.label }}</span>
      </button>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 8px 12px calc(8px + env(safe-area-inset-bottom, 0px));
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: saturate(180%) blur(24px);
      -webkit-backdrop-filter: saturate(180%) blur(24px);
      box-shadow: 0 -4px 24px rgba(0,0,0,0.06);
      z-index: 1000;
      border-top: 1px solid rgba(226, 232, 240, 0.6);
    }
    @media (min-width: 769px) {
      .bottom-nav {
        display: none;
      }
    }
    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      width: 56px;
      height: 50px;
      border: none;
      background: transparent;
      color: #94A3B8;
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: color 200ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      border-radius: 16px;
      -webkit-tap-highlight-color: transparent;
    }
    .bottom-nav-item:active:not(.bottom-nav-item--center) {
      background: #F1F5F9;
      transform: scale(0.92);
    }
    .bottom-nav-item .material-icons {
      font-size: 24px;
      transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .bottom-nav-item--center {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
      color: white;
      transform: translateY(-16px);
      box-shadow: 0 4px 24px rgba(124, 58, 237, 0.3);
      z-index: 1;
    }
    .bottom-nav-item--center .material-icons {
      font-size: 30px;
    }
    .bottom-nav-item--center:active {
      transform: translateY(-12px) scale(0.92);
      box-shadow: 0 2px 16px rgba(124, 58, 237, 0.2);
    }
    .bottom-nav-item--active:not(.bottom-nav-item--center) {
      color: #7C3AED;
    }
    .bottom-nav-item--active .material-icons {
      transform: scale(1.1);
    }
    .bottom-nav-label {
      font-size: 10px;
      line-height: 1;
      white-space: nowrap;
    }
    .bottom-nav-item--center .bottom-nav-label {
      display: none;
    }
  `]
})
export class BottomNavComponent {
  @Input() activeRoute = '';

  tabs = [
    { route: '/dashboard', icon: 'home', label: 'Inicio' },
    { route: '/calendario', icon: 'calendar_month', label: 'Calendario' },
    { route: '/reservas/nueva', icon: 'add', label: 'Nueva', highlight: true },
    { route: '/pagos', icon: 'payments', label: 'Pagos' },
    { route: '/perfil', icon: 'person', label: 'Perfil' },
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
