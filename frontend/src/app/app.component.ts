import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <span class="brand">🔐 PassGuard</span>
      <div class="links">
        <a routerLink="/"        routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Analyzer</a>
        <a routerLink="/history" routerLinkActive="active">History</a>
      </div>
    </nav>
    <router-outlet />
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand { color: #a78bfa; font-weight: 700; font-size: 1.2rem; }
    .links { display: flex; gap: 1.5rem; }
    .links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s;
    }
    .links a:hover, .links a.active { color: #fff; }
  `]
})
export class AppComponent {}
