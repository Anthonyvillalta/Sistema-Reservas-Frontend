import { Component, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header" [class.header--scrolled]="scrolled">
      <div class="header-left">
        <button class="hamburger" (click)="menuToggle.emit()" aria-label="Menú">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <div class="header-clock">
        <div class="header-clock-date">{{ clockDate }}</div>
        <div class="header-clock-time">{{ clockTime }}</div>
      </div>

      <div class="header-actions">
        <button class="notif-btn" title="Notificaciones">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notif-dot"></span>
        </button>
        <!-- Avatar removed per request -->
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed; top: 0; right: 0; left: var(--sidebar-width);
      height: var(--header-height);
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--color-border);
      display: flex; align-items: center;
      padding: 0 var(--space-5); gap: var(--space-2); z-index: 999;
      transition: background var(--transition-base), box-shadow var(--transition-base);
    }
    .header--scrolled {
      background: rgba(255,255,255,0.96);
      box-shadow: 0 1px 16px rgba(0,0,0,0.07);
    }
    .header-left { display: none; }

    /* Hamburger */
    .hamburger {
      width: 38px; height: 38px; border: none;
      background: var(--color-background-alt);
      border-radius: var(--radius-md);
      cursor: pointer; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 4px;
      transition: all var(--transition-fast);
    }
    .hamburger:hover { background: var(--color-border); }
    .hamburger:active { transform: scale(0.92); }
    .hamburger-line {
      display: block; width: 16px; height: 2px;
      background: var(--color-text-primary);
      border-radius: 2px; transition: all var(--transition-base);
    }

    /* Clock */
    .header-clock {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-right: auto;
      background: rgba(241,245,249,0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 4px 14px 4px 14px;
      border-radius: var(--radius-full, 9999px);
      border: 1px solid rgba(226,232,240,0.6);
    }
    .header-clock-date {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-text-tertiary, #94A3B8);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .header-clock-time {
      font-size: 18px;
      font-weight: 700;
      color: #0F172A;
      font-family: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
      letter-spacing: 1.5px;
      background: #FFFFFF;
      padding: 2px 10px 2px 8px;
      border-radius: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.8);
    }
    .header-clock-time::after {
      content: '';
      display: inline-block;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #10B981;
      margin-left: 6px;
      vertical-align: middle;
      animation: clockPulse 2s ease-in-out infinite;
      box-shadow: 0 0 6px rgba(16,185,129,0.4);
    }
    @keyframes clockPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    /* Actions */
    .header-actions { display: flex; align-items: center; gap: var(--space-1); }
    .notif-btn {
      position: relative; background: none; border: none; cursor: pointer;
      width: 38px; height: 38px; border-radius: var(--radius-full);
      display: flex; align-items: center; justify-content: center;
      color: var(--color-text-secondary);
      transition: background var(--transition-fast);
    }
    .notif-btn:hover { background: var(--color-background-alt); }
    .notif-btn:active { transform: scale(0.9); }
    .notif-dot {
      position: absolute; top: 8px; right: 8px;
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--color-danger);
      box-shadow: 0 0 0 2px var(--color-white);
    }
    .header--scrolled .notif-dot { box-shadow: 0 0 0 2px rgba(255,255,255,0.96); }

    /* Avatar removed */

    @media (max-width: 768px) {
      .header { left: 0; padding: 0 var(--space-3); }
      .header-left { display: flex; align-items: center; }
      .header-clock { gap: 8px; padding: 3px 10px 3px 10px; }
      .header-clock-date { font-size: 10px; }
      .header-clock-time { font-size: 15px; padding: 1px 8px 1px 6px; letter-spacing: 1px; }
      .header-clock-time::after { width: 5px; height: 5px; margin-left: 4px; }
    }
    @media (max-width: 380px) {
      .header-clock-date { display: none; }
      .header-clock-time { font-size: 14px; }
      .header { padding: 0 var(--space-2); }
    }
  `],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuToggle = new EventEmitter<void>();
  today = new Date();
  scrolled = false;
  clockDate = '';
  clockTime = '';
  private clockTimer?: ReturnType<typeof setInterval>;

  gradients = [
    'linear-gradient(135deg, #1D4ED8, #3B82F6)',
    'linear-gradient(135deg, #7C3AED, #A855F7)',
    'linear-gradient(135deg, #059669, #10B981)',
    'linear-gradient(135deg, #D97706, #F59E0B)',
    'linear-gradient(135deg, #DC2626, #EF4444)',
    'linear-gradient(135deg, #1E40AF, #2563EB)',
  ];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.updateClock();
    this.clockTimer = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  private updateClock(): void {
    const now = new Date();
    const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    this.clockDate = `${dias[now.getDay()]}, ${now.getDate()} ${meses[now.getMonth()]}`;
    this.clockTime = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled = window.scrollY > 10;
  }

  get initials(): string {
    const user = this.authService.getCurrentUser();
    if (!user?.nombreCompleto) return '?';
    return user.nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  get avatarGradient(): string {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return this.gradients[0];
    return this.gradients[Number(user.id) % this.gradients.length];
  }
}
