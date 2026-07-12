import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CalendarService, CalendarEvent } from '../../core/services/calendar.service';
import { EnvironmentService } from '../../core/services/environment.service';
import { Environment } from '../../models/environment.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="cal">

      <!-- ===== HEADER ===== -->
      <div class="cal-header">
        <div>
          <h1 class="cal-title">Calendario</h1>
          <p class="cal-subtitle">Gestiona disponibilidad y reservas</p>
        </div>
        <a routerLink="/reservas/nueva" class="cal-cta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Reserva
        </a>
      </div>

      <!-- ===== MONTH SELECTOR ===== -->
      <div class="cal-month">
        <button (click)="prevMonth()" class="cal-month-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span class="cal-month-label">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
        <button (click)="nextMonth()" class="cal-month-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <!-- ===== FILTER ===== -->
      <div class="cal-filter">
        <svg class="cal-filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <select [(ngModel)]="filterEnvId" (change)="loadEvents()" class="cal-filter-select">
          <option [value]="0">Todos los ambientes</option>
          <option *ngFor="let e of environments" [value]="e.id">{{ e.nombre }}</option>
        </select>
      </div>

      <!-- ===== LEGEND ===== -->
      <div class="cal-legend">
        <span class="cal-legend-item"><span class="cal-legend-dot" style="background:#2563EB"></span> Reservado</span>
        <span class="cal-legend-item"><span class="cal-legend-dot" style="background:#10B981"></span> Confirmado</span>
        <span class="cal-legend-item"><span class="cal-legend-dot" style="background:#F59E0B"></span> Proceso</span>
        <span class="cal-legend-item"><span class="cal-legend-dot" style="background:#EF4444"></span> Manten.</span>
      </div>

      <!-- ===== GRID ===== -->
      <div class="cal-grid">
        <div class="cal-weekdays">
          <span *ngFor="let d of dayNames">{{ d }}</span>
        </div>
        <div class="cal-body">
          <div *ngFor="let cell of calendarCells" class="cal-cell"
               [class.cal-cell--empty]="!cell.date"
               [class.cal-cell--today]="cell.isToday"
               [class.cal-cell--selected]="selectedDate === cell.date"
               (click)="selectDay(cell)">
            <span class="cal-day-num" *ngIf="cell.date">{{ cell.day }}</span>
            <div class="cal-dots" *ngIf="cell.events.length > 0">
              <span *ngFor="let ev of cell.events.slice(0, 3)" class="cal-dot" [style.background]="ev.color"></span>
              <span *ngIf="cell.events.length > 3" class="cal-dot-more">+{{ cell.events.length - 3 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== DAY DETAIL ===== -->
      <div class="cal-cards" *ngIf="selectedDayEvents.length > 0">
        <div class="cal-cards-head">
          <span class="cal-cards-date">{{ selectedDateLabel }}</span>
          <span class="cal-cards-count">{{ selectedDayEvents.length }} {{ selectedDayEvents.length === 1 ? 'evento' : 'eventos' }}</span>
        </div>
        <div class="cal-cards-list">
          <a *ngFor="let ev of selectedDayEvents" class="cal-card" [routerLink]="ev.editable ? ['/reservas', ev.id] : null" [class.cal-card--linked]="ev.editable">
            <div class="cal-card-bar" [style.background]="ev.color"></div>
            <div class="cal-card-body">
              <div class="cal-card-top">
                <span class="cal-card-badge" [style.background]="ev.color">{{ ev.estado }}</span>
              </div>
              <strong class="cal-card-title">{{ ev.titulo }}</strong>
              <div class="cal-card-meta">
                <span class="cal-card-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  {{ ev.ambienteNombre }}
                </span>
                <span class="cal-card-meta-item" *ngIf="ev.clienteNombre">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {{ ev.clienteNombre }}
                </span>
              </div>
            </div>
            <svg *ngIf="ev.editable" class="cal-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </a>
        </div>
      </div>

      <!-- empty -->
      <div class="cal-empty" *ngIf="selectedDayEvents.length === 0 && selectedDate">
        <div class="cal-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <p class="cal-empty-text">Sin eventos este día</p>
      </div>
    </div>
  `,
  styles: [`
    /* =============================================================
       CALENDARIO — MOBILE-FIRST PREMIUM
       Diseño tipo Google Calendar / Booking.com
       ============================================================= */

    .cal {
      max-width: 560px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 24px;
      min-height: calc(100vh - 140px);
      animation: calFade 0.3s ease both;
    }
    @keyframes calFade {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ===== HEADER ===== */
    .cal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 12px;
    }
    .cal-title {
      font-size: 22px; font-weight: 700; color: #1E293B;
      margin: 0; line-height: 1.2;
    }
    .cal-subtitle {
      font-size: 13px; color: #94A3B8;
      margin: 2px 0 0;
    }
    .cal-cta {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 12px 18px;
      background: #2563EB; color: #fff;
      border-radius: 14px;
      font-size: 13px; font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(37,99,235,0.25);
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .cal-cta:active { transform: scale(0.95); }

    /* ===== MONTH ===== */
    .cal-month {
      display: flex; align-items: center; justify-content: center; gap: 16px;
      background: #fff;
      border-radius: 14px;
      padding: 12px 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
    }
    .cal-month-btn {
      width: 36px; height: 36px;
      border: none; border-radius: 50%;
      background: #F1F5F9;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #475569;
      transition: all 0.15s;
    }
    .cal-month-btn:active { transform: scale(0.9); background: #E2E8F0; }
    .cal-month-label {
      font-size: 17px; font-weight: 700; color: #1E293B;
      min-width: 140px; text-align: center;
    }

    /* ===== FILTER ===== */
    .cal-filter {
      position: relative; display: flex; align-items: center;
      background: #fff;
      border-radius: 14px;
      padding: 0 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .cal-filter-icon {
      color: #94A3B8; flex-shrink: 0;
      pointer-events: none;
    }
    .cal-filter-select {
      width: 100%; height: 46px;
      padding: 0 12px;
      border: none; border-radius: 14px;
      font-size: 14px; font-weight: 500; font-family: inherit;
      background: transparent;
      color: #1E293B;
      outline: none;
      -webkit-appearance: none; appearance: none;
      cursor: pointer;
    }
    .cal-filter-select:focus { box-shadow: 0 0 0 3px rgba(37,99,235,0.12); border-radius: 14px; }

    /* ===== LEGEND ===== */
    .cal-legend {
      display: flex; gap: 8px; flex-wrap: wrap;
    }
    .cal-legend-item {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 10px;
      background: #fff;
      border-radius: 20px;
      font-size: 11px; font-weight: 600; color: #475569;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .cal-legend-dot {
      width: 7px; height: 7px; border-radius: 50%;
    }

    /* ===== GRID ===== */
    .cal-grid {
      background: #fff;
      border-radius: 18px;
      padding: 12px 8px 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
      display: flex; flex-direction: column;
      flex: 1;
      min-height: 0;
    }
    .cal-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-size: 11px; font-weight: 600;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding-bottom: 8px;
      margin-bottom: 4px;
      border-bottom: 1px solid #F1F5F9;
      flex-shrink: 0;
    }
    .cal-body {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: repeat(6, 1fr);
      gap: 1px;
      flex: 1;
    }
    .cal-cell {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 2px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.1s;
    }
    .cal-cell:active { transform: scale(0.92); background: #F8FAFC; }
    .cal-cell--empty { cursor: default; }
    .cal-cell--empty:active { transform: none; background: transparent; }
    .cal-cell--today .cal-day-num {
      background: #2563EB; color: #fff;
    }
    .cal-cell--selected { background: #F1F5F9; }
    .cal-day-num {
      font-size: 13px; font-weight: 600;
      color: #1E293B; line-height: 1;
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .cal-dots {
      display: flex; gap: 2px; align-items: center; justify-content: center;
      height: 6px;
    }
    .cal-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
    .cal-dot-more { font-size: 7px; font-weight: 700; color: #94A3B8; line-height: 1; }

    /* ===== DAY CARDS ===== */
    .cal-cards {
      background: #fff;
      border-radius: 18px;
      padding: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
      animation: calDetailIn 0.2s ease both;
    }
    @keyframes calDetailIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cal-cards-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 10px;
    }
    .cal-cards-date { font-size: 13px; font-weight: 700; color: #1E293B; }
    .cal-cards-count { font-size: 11px; font-weight: 600; color: #94A3B8; }
    .cal-cards-list { display: flex; flex-direction: column; gap: 8px; }
    .cal-card {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px;
      background: #F8FAFC;
      border-radius: 14px;
      text-decoration: none; color: inherit;
      transition: all 0.15s;
      border: 1px solid #E2E8F0;
    }
    .cal-card--linked:active { transform: scale(0.98); background: #F1F5F9; }
    .cal-card-bar { width: 4px; height: 48px; border-radius: 2px; flex-shrink: 0; }
    .cal-card-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
    .cal-card-top { display: flex; align-items: center; gap: 6px; }
    .cal-card-badge {
      font-size: 9px; font-weight: 700; padding: 2px 8px;
      border-radius: 20px; color: #fff; text-transform: uppercase; letter-spacing: 0.3px;
    }
    .cal-card-title { font-size: 14px; font-weight: 700; color: #1E293B; }
    .cal-card-meta { display: flex; gap: 12px; flex-wrap: wrap; }
    .cal-card-meta-item {
      display: inline-flex; align-items: center; gap: 3px;
      font-size: 11px; font-weight: 500; color: #64748B;
    }
    .cal-card-meta-item svg { color: #94A3B8; flex-shrink: 0; }
    .cal-card-arrow { color: #94A3B8; flex-shrink: 0; }
    .cal-detail-link:hover { background: #fff; color: #1E293B; }

    /* ===== EMPTY ===== */
    .cal-empty {
      display: flex; flex-direction: column; align-items: center;
      padding: 24px;
      text-align: center;
    }
    .cal-empty-icon {
      width: 48px; height: 48px;
      border-radius: 50%;
      background: #F1F5F9;
      display: flex; align-items: center; justify-content: center;
      color: #94A3B8;
      margin-bottom: 8px;
    }
    .cal-empty-text {
      font-size: 14px; font-weight: 500; color: #94A3B8;
      margin: 0;
    }

    /* ===== RESET LEGACY ===== */
    .card { box-shadow: none; }
  `]
})
export class CalendarViewComponent implements OnInit {
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  filterEnvId = 0;
  selectedDate: string | null = null;

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  environments: Environment[] = [];
  calendarCells: any[] = [];
  selectedDayEvents: CalendarEvent[] = [];

  constructor(
    private calendarService: CalendarService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.environmentService.findAll().subscribe((data) => {
      this.environments = data;
    });
    this.loadEvents();
  }

  get selectedDateLabel(): string {
    if (!this.selectedDate) return '';
    const d = new Date(this.selectedDate + 'T12:00:00');
    const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
    this.selectedDate = null;
    this.selectedDayEvents = [];
    this.loadEvents();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
    this.selectedDate = null;
    this.selectedDayEvents = [];
    this.loadEvents();
  }

  loadEvents(): void {
    this.calendarService.getMonth(this.currentYear, this.currentMonth + 1, this.filterEnvId || undefined).subscribe({
      next: (events) => this.buildCalendar(events),
    });
  }

  buildCalendar(events: CalendarEvent[]): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const today = new Date();

    const cells: any[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ date: null, day: 0, events: [], isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter((e) => e.inicio.startsWith(dateStr));
      const isToday =
        day === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear();

      cells.push({ date: dateStr, day, events: dayEvents, isToday });
    }

    this.calendarCells = cells;

    // Auto-select today if it has events
    const todayStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear()) {
      const todayCell = cells.find(c => c.date === todayStr);
      if (todayCell && todayCell.events.length > 0) {
        this.selectedDate = todayStr;
        this.selectedDayEvents = todayCell.events;
      }
    }
  }

  selectDay(cell: any): void {
    if (!cell.date) return;
    this.selectedDate = cell.date;
    this.selectedDayEvents = cell.events;
  }
}