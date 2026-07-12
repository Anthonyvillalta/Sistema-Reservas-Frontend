import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-bottom-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bottom-nav">
      <button *ngFor="let tab of tabs"
              class="bottom-nav-item"
              [class.bottom-nav-item--active]="activeRoute === tab.route"
              [class.bottom-nav-item--center]="tab.highlight"
              (click)="navigate(tab.route)">
        <span class="material-icons">{{ tab.icon }}</span>
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
      justify-content: space-between;
      align-items: center;
      padding: 0 18px 12px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(18px);
      box-shadow: 0 -18px 38px rgba(15, 23, 42, 0.12);
      border-top: 1px solid rgba(15, 23, 42, 0.1);
      z-index: 1000;
      min-height: calc(78px + env(safe-area-inset-bottom, 0));
    }

    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 56px;
      height: 56px;
      border: none;
      background: transparent;
      color: #64748b;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: color 0.2s ease, transform 0.2s ease;
      position: relative;
    }

    .bottom-nav-item--center {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #16a34a;
      color: white;
      transform: translateY(-12px);
      box-shadow: 0 20px 40px rgba(22, 163, 74, 0.24);
    }

    .bottom-nav-item--active:not(.bottom-nav-item--center) {
      color: #2563eb;
    }

    .bottom-nav-item .material-icons {
      font-size: 24px;
      transition: transform 0.2s ease;
    }

    .bottom-nav-item--active .material-icons,
    .bottom-nav-item--center .material-icons {
      transform: scale(1.2);
    }

    .bottom-nav-label {
      font-size: 10px;
      line-height: 1;
    }
  `]
})
export class MobileBottomNavigationComponent {
  @Input() activeRoute = '';

  tabs = [
    { route: 'm/home', icon: 'home', label: 'Inicio' },
    { route: 'm/my-reservations', icon: 'event', label: 'Reservas' },
    { route: 'm/environment-detail', icon: 'add_circle', label: 'Reservar', highlight: true },
    { route: 'm/splash', icon: 'calendar_month', label: 'Calendario' },
    { route: 'm/profile', icon: 'person', label: 'Perfil' },
  ];

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
