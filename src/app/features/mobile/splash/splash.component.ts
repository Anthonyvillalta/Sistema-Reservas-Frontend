import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash">
      <div class="splash-content">
        <div class="splash-icon">🌿</div>
        <h1 class="splash-title">Campestre<br/>José Antonio</h1>
        <p class="splash-subtitle">Centro Recreacional</p>
        <div class="splash-loader">
          <div class="splash-spinner"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .splash {
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1E40AF, #1D4ED8, #2563EB);
      padding: var(--space-6);
    }
    .splash-content { text-align: center; animation: fadeInUp 0.8s ease forwards; }
    .splash-icon { font-size: 4rem; margin-bottom: var(--space-4); }
    .splash-title { font-size: 1.75rem; font-weight: 700; color: white; line-height: 1.3; margin-bottom: var(--space-2); }
    .splash-subtitle { font-size: var(--text-base); color: rgba(255,255,255,0.8); margin-bottom: var(--space-8); }
    .splash-loader { display: flex; justify-content: center; }
    .splash-spinner { width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
  `]
})
export class SplashComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/m/login']);
    }, 2000);
  }
}
