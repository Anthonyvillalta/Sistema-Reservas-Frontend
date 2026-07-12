import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-desktop-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="desktop-layout">
      <app-sidebar [open]="sidebarOpen" (close)="sidebarOpen = false"></app-sidebar>
      <div class="desktop-backdrop" *ngIf="sidebarOpen" (click)="sidebarOpen = false"></div>
      <div class="desktop-main">
        <app-header *ngIf="showHeader" (menuToggle)="toggleSidebar()"></app-header>
        <main class="desktop-content" [class.no-header]="!showHeader" [class.is-dashboard]="isDashboard">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .desktop-layout {
      display: flex;
      min-height: 100vh;
      background: #F5F7FB;
    }
    .desktop-backdrop { display: none; }
    .desktop-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: var(--sidebar-width);
      min-height: 100vh;
      transition: margin-left var(--transition-base);
    }
    .desktop-content {
      flex: 1;
      padding: var(--space-6);
      margin-top: var(--header-height);
      width: 100%;
    }
    .desktop-content.no-header {
      margin-top: 0;
    }
    /* Dashboard has its own padding, remove parent padding */
    .desktop-content.is-dashboard {
      padding: 0;
    }
    @media (max-width: 768px) {
      .desktop-main { margin-left: 0; }
      .desktop-content {
        padding: 20px 16px;
        padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px));
      }
      .desktop-content.is-dashboard {
        padding: 0;
        padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px));
      }
      .desktop-backdrop {
        display: block;
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
      }
    }
  `]
})
export class DesktopLayoutComponent {
  sidebarOpen = false;
  showHeader = true;
  isDashboard = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e) => {
      const url = e.urlAfterRedirects || e.url;
      this.showHeader = !url.startsWith('/dashboard');
      this.isDashboard = url.startsWith('/dashboard');
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
