import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../../core/services/reservation.service';
import { EnvironmentService } from '../../../core/services/environment.service';
import { Environment } from '../../../models/environment.model';
import { Disponibilidad } from '../../../models/reservation.model';

@Component({
  selector: 'app-date-time-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="date-time">
      <div class="env-info" *ngIf="env">
        <span class="env-name">{{ env.nombre }}</span>
        <span class="env-price">S/ {{ env.precioBase | number:'1.2-2' }} {{ env.tipo === 'HORAS' ? '/hora' : '' }}</span>
      </div>

      <div class="calendar-section">
        <div class="calendar-header">
          <button class="cal-nav" (click)="prevMonth()">‹</button>
          <span class="cal-month">{{ monthNames[month] }} {{ year }}</span>
          <button class="cal-nav" (click)="nextMonth()">›</button>
        </div>

        <div class="calendar-grid">
          <span class="cal-day-header" *ngFor="let d of dayNames">{{ d }}</span>
          <ng-container *ngFor="let cell of calendarCells">
            <div *ngIf="cell" class="cal-cell"
                 [class.cal-cell--selected]="cell.date === selectedDate"
                 [class.cal-cell--today]="cell.isToday"
                 (click)="selectDate(cell.date)">
              <span>{{ cell.day }}</span>
            </div>
            <div *ngIf="!cell" class="cal-cell cal-cell--empty"></div>
          </ng-container>
        </div>
      </div>

      <div class="time-section" *ngIf="env?.tipo === 'HORAS' && selectedDate">
        <h3 class="section-title">Seleccionar horario</h3>
        <div class="time-grid">
          <button *ngFor="let slot of timeSlots" class="time-slot"
                  [class.time-slot--selected]="selectedTime === slot"
                  [class.time-slot--disabled]="isSlotDisabled(slot)"
                  (click)="selectTime(slot)"
                  [disabled]="isSlotDisabled(slot)">
            {{ slot }}
          </button>
        </div>
      </div>

      <button class="btn-next" (click)="next()" [disabled]="!selectedDate">
        Siguiente
      </button>
    </div>
  `,
  styles: [`
    .date-time { display: flex; flex-direction: column; gap: var(--space-5); }
    .env-info { display: flex; justify-content: space-between; align-items: center; }
    .env-name { font-size: var(--text-lg); font-weight: 600; }
    .env-price { font-size: var(--text-base); color: var(--color-primary); font-weight: 700; }
    .calendar-section { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-4); box-shadow: var(--shadow-sm); }
    .calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); }
    .cal-nav { background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: var(--space-2); color: var(--color-text-primary); }
    .cal-month { font-size: var(--text-lg); font-weight: 600; }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
    .cal-day-header { text-align: center; font-size: var(--text-xs); font-weight: 600; color: var(--color-text-tertiary); padding: var(--space-2); }
    .cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: var(--text-sm); border-radius: var(--radius-full); cursor: pointer; transition: all var(--transition-fast); }
    .cal-cell:hover { background: var(--color-background-alt); }
    .cal-cell--empty { cursor: default; }
    .cal-cell--selected { background: var(--color-primary); color: white; font-weight: 600; }
    .cal-cell--today { border: 2px solid var(--color-primary); font-weight: 600; }
    .time-section { background: var(--color-surface); border-radius: var(--radius-lg); padding: var(--space-4); box-shadow: var(--shadow-sm); }
    .section-title { font-size: var(--text-base); font-weight: 600; margin-bottom: var(--space-3); }
    .time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-2); }
    .time-slot { padding: 10px; text-align: center; border: 2px solid var(--color-border); border-radius: var(--radius-md); background: white; cursor: pointer; font-family: var(--font-family); font-size: var(--text-sm); transition: all var(--transition-fast); }
    .time-slot--selected { border-color: var(--color-primary); background: var(--color-primary-light); color: var(--color-primary); font-weight: 600; }
    .time-slot--disabled { opacity: 0.4; cursor: not-allowed; background: var(--color-background-alt); }
    .btn-next { width: 100%; padding: 16px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: var(--text-lg); font-weight: 600; cursor: pointer; font-family: var(--font-family); margin-top: var(--space-2); }
    .btn-next:disabled { background: var(--color-border); color: var(--color-text-tertiary); cursor: not-allowed; }
  `]
})
export class DateTimeSelectionComponent implements OnInit {
  env?: Environment;
  envId = 0;
  selectedDate = '';
  selectedTime = '';
  month = new Date().getMonth();
  year = new Date().getFullYear();
  dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
  calendarCells: (any)[] = [];
  timeSlots = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  occupiedSlots: string[] = [];
  disponibilidad?: Disponibilidad;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private envService: EnvironmentService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.envId = +this.route.snapshot.paramMap.get('id')!;
    this.envService.findById(this.envId).subscribe({ next: (data) => { this.env = data; } });
    this.buildCalendar();
  }

  buildCalendar(): void {
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const today = new Date();
    const cells: any[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && this.month === today.getMonth() && this.year === today.getFullYear();
      const dateStr = `${this.year}-${String(this.month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells.push({ day: d, date: dateStr, isToday });
    }
    this.calendarCells = cells;
  }

  prevMonth(): void { this.month--; if (this.month < 0) { this.month = 11; this.year--; } this.buildCalendar(); }
  nextMonth(): void { this.month++; if (this.month > 11) { this.month = 0; this.year++; } this.buildCalendar(); }

  selectDate(date: string): void {
    if (!date) return;
    this.selectedDate = date;
    this.selectedTime = '';
    this.reservationService.checkDisponibilidad(this.envId, date).subscribe({
      next: (d) => { this.disponibilidad = d; this.occupiedSlots = d.horariosOcupados || []; }
    });
  }

  isSlotDisabled(slot: string): boolean {
    return this.occupiedSlots.includes(slot);
  }

  selectTime(slot: string): void {
    if (this.isSlotDisabled(slot)) return;
    this.selectedTime = slot;
  }

  next(): void {
    if (!this.selectedDate) return;
    this.router.navigate(['/m/reservar', this.envId, 'datos'], {
      queryParams: { fecha: this.selectedDate, hora: this.selectedTime || undefined }
    });
  }
}
