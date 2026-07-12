import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, filter, takeUntil } from 'rxjs';
import { MobileBottomNavigationComponent } from '../../shared/components/mobile-bottom-navigation/mobile-bottom-navigation.component';
import { DeviceService } from '../../core/services/device.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MobileBottomNavigationComponent],
  template: `
    <div class="mobile-layout">
      <!-- Top Bar -->
      <header class="mobile-header">
        <button class="mobile-back" *ngIf="showBack" (click)="goBack()">
          <span class="material-icons">arrow_back</span>
        </button>
        <div class="mobile-header-content">
          <span class="mobile-title">{{ pageTitle }}</span>
        </div>
        <button class="mobile-header-action" *ngIf="showProfile" (click)="goToProfile()">
          <div class="mobile-avatar">{{ initials }}</div>
        </button>
      </header>

      <!-- Content -->
      <main class="mobile-content" [class.mobile-content--auth]="isAuthPage">
        <router-outlet></router-outlet>
      </main>

      <!-- Bottom Navigation -->
      <app-mobile-bottom-navigation
        *ngIf="!isAuthPage"
        [activeRoute]="currentRoute">
      </app-mobile-bottom-navigation>
    </div>
  `,
  styles: [`
    .mobile-layout {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
      background: var(--color-background);
    }
    .mobile-header {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 var(--space-4);
      background: var(--color-primary);
      color: var(--color-text-inverse);
      gap: var(--space-2);
    }
    .mobile-back {
      background: none;
      border: none;
      color: var(--color-text-inverse);
      cursor: pointer;
      padding: var(--space-2);
      display: flex;
      align-items: center;
      border-radius: var(--radius-sm);
    }
    .mobile-back:hover { background: rgba(255,255,255,0.1); }
    .mobile-header-content { flex: 1; }
    .mobile-title {
      font-size: var(--text-lg);
      font-weight: 600;
      display: block;
    }
    .mobile-header-action { background: none; border: none; cursor: pointer; }
    .mobile-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      color: var(--color-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-sm);
      font-weight: 600;
    }
    .mobile-content {
      flex: 1;
      padding: var(--space-4);
      padding-bottom: calc(var(--mobile-nav-height) + var(--space-4));
    }
    .mobile-content--auth {
      padding: 0;
      padding-bottom: 0;
    }
  `]
})
export class MobileLayoutComponent implements OnInit, OnDestroy {
  currentRoute = '';
  pageTitle = '';
  showBack = false;
  showProfile = false;
  isAuthPage = false;
  initials = '?';
  private destroy$ = new Subject<void>();

  private routeTitles: Record<string, string> = {
    'm/splash': '',
    'm/login': 'Iniciar Sesión',
    'm/home': 'Inicio',
    'm/environment-detail': 'Detalle',
    'm/date-time-selection': 'Seleccionar Fecha',
    'm/booking-form': 'Datos de Reserva',
    'm/payment': 'Pago',
    'm/confirmation': 'Confirmación',
    'm/my-reservations': 'Mis Reservas',
    'm/profile': 'Mi Perfil',
  };

  private noBackRoutes = ['m/home', 'm/splash', 'm/login'];

  constructor(
    private router: Router,
    private deviceService: DeviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateInitials();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateRoute();
    });
    this.updateRoute();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateRoute(): void {
    const url = this.router.url;
    this.isAuthPage = url.includes('/login') || url.includes('/splash');

    // Extract the route key
    const segments = url.split('/').filter(s => s);
    // For /m/home -> key is 'm/home'
    const routeKey = segments.slice(0, 2).join('/');
    this.currentRoute = routeKey;

    this.pageTitle = this.routeTitles[routeKey] || 'Campestre';
    this.showBack = !this.noBackRoutes.includes(routeKey) && !this.isAuthPage;
    this.showProfile = !this.isAuthPage;
  }

  private updateInitials(): void {
    const user = this.authService.getCurrentUser();
    if (user?.nombreCompleto) {
      this.initials = user.nombreCompleto
        .split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
  }

  goBack(): void {
    window.history.back();
  }

  goToProfile(): void {
    this.router.navigate(['/m/profile']);
  }
}
