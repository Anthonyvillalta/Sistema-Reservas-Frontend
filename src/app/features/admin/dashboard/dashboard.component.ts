import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../../core/services/auth.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { EnvironmentService } from '../../../core/services/environment.service';
import { QuickActionCardComponent } from '../../../shared/components/quick-action-card/quick-action-card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ReservationListItemComponent } from '../../../shared/components/reservation-list-item/reservation-list-item.component';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { QuickAction, MonthlyStat, UpcomingReservation, IngresoMensual } from './dashboard.models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    QuickActionCardComponent,
    StatCardComponent,
    ReservationListItemComponent,
    BottomNavComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('incomeChart') incomeChartCanvas?: ElementRef<HTMLCanvasElement>;

  private chartInstance?: Chart;
  today = new Date();

  quickActions: QuickAction[] = [
    { icon: 'calendar_add_on', label: 'Nueva Reserva', route: '/reservas/nueva', color: '#7C3AED' },
    { icon: 'groups', label: 'Clientes', route: '/clientes', color: '#059669' },
    { icon: 'account_balance_wallet', label: 'Pagos', route: '/pagos', color: '#D97706' },
    { icon: 'bar_chart', label: 'Reportes', route: '/reportes', color: '#7C3AED' },
  ];

  monthlyStats: MonthlyStat[] = [
    { icon: 'event', value: '12', label: 'Reservas', color: '#7C3AED' },
    { icon: 'payments', value: 'S/ 4,250', label: 'Ingresos', color: '#059669' },
    { icon: 'people', value: '8', label: 'Clientes', color: '#D97706' },
    { icon: 'house', value: '3', label: 'Ambientes', color: '#7C3AED' },
  ];

  upcomingReservations: UpcomingReservation[] = [
    { id: 1, ambienteNombre: 'Piscina + Salón', fecha: '15 Jun 2025', horaInicio: '2:00 PM', horaFin: '8:00 PM', estado: 'Confirmada', imagenUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b84c2b6?w=200&h=200&fit=crop' },
    { id: 2, ambienteNombre: 'Salón Principal', fecha: '18 Jun 2025', horaInicio: '10:00 AM', horaFin: '6:00 PM', estado: 'Pendiente', imagenUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop' },
    { id: 3, ambienteNombre: 'Áreas Verdes', fecha: '20 Jun 2025', horaInicio: '8:00 AM', horaFin: '4:00 PM', estado: 'Confirmada', imagenUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&h=200&fit=crop' },
  ];

  nextReservation = {
    fecha: '15 Jun 2025',
    horaInicio: '2:00 PM',
    horaFin: '8:00 PM',
    ambienteNombre: 'Piscina + Salón',
    imagenUrl: '',
  };

  private incomeData: IngresoMensual[] = [
    { mes: 'Ene', ingresos: 2800 },
    { mes: 'Feb', ingresos: 3200 },
    { mes: 'Mar', ingresos: 2900 },
    { mes: 'Abr', ingresos: 3800 },
    { mes: 'May', ingresos: 3600 },
    { mes: 'Jun', ingresos: 4250 },
  ];

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.nextReservation.imagenUrl = this.getEnvImage(this.nextReservation.ambienteNombre);
  }

  getEnvImage(name: string): string {
    const images: Record<string, string> = {
      'Piscina': 'https://images.unsplash.com/photo-1576013551627-0cc20b84c2b6?w=400&h=300&fit=crop',
      'Salón Principal': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop',
      'Área Verde': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
      'Cancha de Grass': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop',
      'Piscina + Salón': 'https://images.unsplash.com/photo-1576013551627-0cc20b84c2b6?w=400&h=300&fit=crop',
    };
    return images[name] || 'https://images.unsplash.com/photo-1576013551627-0cc20b84c2b6?w=400&h=300&fit=crop';
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initChart(), 200);
  }

  ngOnDestroy(): void {
    this.chartInstance?.destroy();
  }

  get userName(): string {
    const user = this.authService.getCurrentUser();
    return user?.nombreCompleto?.split(' ')[0] || 'Administrador';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase();
  }

  private initChart(): void {
    if (!this.incomeChartCanvas) return;

    const ctx = this.incomeChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.incomeData.map(d => d.mes);
    const data = this.incomeData.map(d => d.ingresos);

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(124, 58, 237, 0.2)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Ingresos',
          data,
          borderColor: '#7C3AED',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#7C3AED',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            cornerRadius: 12,
            padding: 12,
            callbacks: {
              label: (ctx) => `S/ ${(ctx.parsed.y ?? 0).toLocaleString('es-PE')}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#94A3B8',
              font: { size: 11, family: 'Inter' },
            },
          },
          y: {
            grid: { color: '#F1F5F9' },
            ticks: {
              color: '#94A3B8',
              font: { size: 11, family: 'Inter' },
              callback: (value) => `S/${value}`,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });
  }

  private loadDashboardData(): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    this.reservationService.findAll({ fechaInicio: hoy.toISOString(), fechaFin: manana.toISOString() })
      .subscribe({
        next: (reservas) => {
          this.monthlyStats[0] = { ...this.monthlyStats[0], value: String(reservas.length) };
        },
      });

    this.reservationService.findAll({ fechaInicio: hoy.toISOString() })
      .subscribe({
        next: (reservas) => {
          const activas = reservas
            .filter(r => r.estado !== 'CANCELADO' && r.estado !== 'FINALIZADO')
            .sort((a, b) => new Date(a.fechaInicio!).getTime() - new Date(b.fechaInicio!).getTime())
            .slice(0, 5);
          this.upcomingReservations = activas.length > 0
            ? activas.map(r => ({
                id: r.id!,
                ambienteNombre: r.ambienteNombre || 'Sin nombre',
                fecha: r.fechaInicio ? new Date(r.fechaInicio).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
                horaInicio: r.horaInicio || '00:00',
                horaFin: r.horaFin || '23:59',
                estado: r.estado || 'Pendiente',
              }))
            : this.upcomingReservations;

          const totalIngresos = reservas.reduce((sum, r) => sum + (r.precioTotal || 0), 0);
          this.monthlyStats[1] = { ...this.monthlyStats[1], value: `S/ ${totalIngresos.toLocaleString('es-PE')}` };
        },
      });

    this.environmentService.findAll().subscribe({
      next: (envs) => {
        this.monthlyStats[3] = { ...this.monthlyStats[3], value: String(envs.length) };
      },
    });
  }
}
