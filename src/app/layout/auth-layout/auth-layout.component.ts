import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1E40AF 0%, #1D4ED8 50%, #2563EB 100%);
      padding: var(--space-4);
    }
  `]
})
export class AuthLayoutComponent {}
