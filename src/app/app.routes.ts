import { Routes } from '@angular/router';
import { adminGuard, mobileGuard } from './core/guards/auth.guard';
import { DesktopLayoutComponent } from './layout/desktop-layout/desktop-layout.component';
import { MobileLayoutComponent } from './layout/mobile-layout/mobile-layout.component';
import { retryImport } from './shared/utils/retry-import';

export const routes: Routes = [
  // ===== LANDING (detecta dispositivo y redirige) =====
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // ===== LOGIN (responsive, funciona en desktop y mobile) =====
  { path: 'login', loadComponent: retryImport(() => import('./pages/login/login.component').then(m => m.LoginComponent)) },

  // ===== ADMIN — DesktopLayout =====
  {
    path: '',
    component: DesktopLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', loadComponent: retryImport(() => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)) },
      { path: 'clientes', loadComponent: retryImport(() => import('./features/admin/clients/client-list.component').then(m => m.ClientListComponent)) },
      { path: 'clientes/nuevo', loadComponent: retryImport(() => import('./features/admin/clients/client-form.component').then(m => m.ClientFormComponent)) },
      { path: 'clientes/:id/editar', loadComponent: retryImport(() => import('./features/admin/clients/client-form.component').then(m => m.ClientFormComponent)) },
      { path: 'ambientes', loadComponent: retryImport(() => import('./features/admin/environments/environment-list.component').then(m => m.EnvironmentListComponent)) },
      { path: 'ambientes/nuevo', loadComponent: retryImport(() => import('./features/admin/environments/environment-form.component').then(m => m.EnvironmentFormComponent)) },
      { path: 'ambientes/:id/editar', loadComponent: retryImport(() => import('./features/admin/environments/environment-form.component').then(m => m.EnvironmentFormComponent)) },
      { path: 'reservas', loadComponent: retryImport(() => import('./features/admin/reservations/reservation-list.component').then(m => m.ReservationListComponent)) },
      { path: 'reservas/nueva', loadComponent: retryImport(() => import('./features/admin/reservations/reservation-form.component').then(m => m.ReservationFormComponent)) },
      { path: 'reservas/:id', loadComponent: retryImport(() => import('./features/admin/reservations/reservation-detail.component').then(m => m.ReservationDetailComponent)) },
      { path: 'pagos', loadComponent: retryImport(() => import('./features/admin/payments/payment-list.component').then(m => m.PaymentListComponent)) },
      { path: 'calendario', loadComponent: retryImport(() => import('./pages/calendar/calendar-view.component').then(m => m.CalendarViewComponent)) },
      { path: 'mantenimientos', loadComponent: retryImport(() => import('./pages/maintenance/maintenance.component').then(m => m.MaintenanceComponent)) },
      { path: 'notificaciones', loadComponent: retryImport(() => import('./pages/notifications/notification-history.component').then(m => m.NotificationHistoryComponent)) },
      { path: 'reportes', loadComponent: retryImport(() => import('./pages/reports/reports.component').then(m => m.ReportsComponent)) },
    ],
  },

  // ===== MOBILE — MobileLayout =====
  {
    path: 'm',
    component: MobileLayoutComponent,
    children: [
      { path: '', redirectTo: 'splash', pathMatch: 'full' },
      { path: 'splash', loadComponent: retryImport(() => import('./features/mobile/splash/splash.component').then(m => m.SplashComponent)) },
      { path: 'login', loadComponent: retryImport(() => import('./features/mobile/login/login.component').then(m => m.MobileLoginComponent)) },
      { path: 'home', loadComponent: retryImport(() => import('./features/mobile/home/home.component').then(m => m.HomeComponent)), canActivate: [mobileGuard] },
      { path: 'ambientes/:id', loadComponent: retryImport(() => import('./features/mobile/environment-detail/environment-detail.component').then(m => m.EnvironmentDetailComponent)), canActivate: [mobileGuard] },
      { path: 'reservar/:id/fecha', loadComponent: retryImport(() => import('./features/mobile/date-time-selection/date-time-selection.component').then(m => m.DateTimeSelectionComponent)), canActivate: [mobileGuard] },
      { path: 'reservar/:id/datos', loadComponent: retryImport(() => import('./features/mobile/booking-form/booking-form.component').then(m => m.BookingFormComponent)), canActivate: [mobileGuard] },
      { path: 'reservar/:id/pago', loadComponent: retryImport(() => import('./features/mobile/payment/payment.component').then(m => m.MobilePaymentComponent)), canActivate: [mobileGuard] },
      { path: 'reservar/:id/confirmacion', loadComponent: retryImport(() => import('./features/mobile/confirmation/confirmation.component').then(m => m.ConfirmationComponent)), canActivate: [mobileGuard] },
      { path: 'mis-reservas', loadComponent: retryImport(() => import('./features/mobile/my-reservations/my-reservations.component').then(m => m.MyReservationsComponent)), canActivate: [mobileGuard] },
      { path: 'perfil', loadComponent: retryImport(() => import('./features/mobile/profile/profile.component').then(m => m.ProfileComponent)), canActivate: [mobileGuard] },
    ],
  },

  // ===== WILDCARD =====
  { path: '**', redirectTo: '/login' },
];
