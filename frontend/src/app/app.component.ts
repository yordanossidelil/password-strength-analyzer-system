import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <canvas #matrix class="matrix-canvas"></canvas>

    <nav class="navbar">
      <div class="brand">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L4 7v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V7L14 2z"
            stroke="#00ff88" stroke-width="1.5" fill="rgba(0,255,136,0.08)"/>
          <path d="M10 14l3 3 5-5" stroke="#00ff88" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="brand-text">PASS<span class="brand-accent">GUARD</span></span>
      </div>

      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          ANALYZER
        </a>
        <a routerLink="/history" routerLinkActive="active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
          </svg>
          HISTORY
        </a>
      </div>

      <div class="status-pill">
        <span class="dot"></span> SYSTEM ONLINE
      </div>
    </nav>

    <router-outlet />
  `,
  styles: [`
    .matrix-canvas {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
      opacity: 0.07;
      pointer-events: none;
    }

    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 60px;
      background: rgba(2, 12, 6, 0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      box-shadow: 0 1px 30px rgba(0,255,136,0.05);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
    }

    .brand-text {
      font-family: var(--display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--text);
      letter-spacing: 3px;
    }

    .brand-accent { color: var(--green); }

    .nav-links {
      display: flex;
      gap: 0.25rem;

      a {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 1rem;
        border-radius: 4px;
        font-family: var(--mono);
        font-size: 0.72rem;
        letter-spacing: 2px;
        color: var(--text-dim);
        text-decoration: none;
        border: 1px solid transparent;
        transition: all 0.2s;

        &:hover {
          color: var(--green);
          border-color: var(--border);
          background: var(--green-glow);
        }

        &.active {
          color: var(--green);
          border-color: var(--border-bright);
          background: var(--green-glow);
          box-shadow: 0 0 12px rgba(0,255,136,0.1);
        }
      }
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--mono);
      font-size: 0.65rem;
      letter-spacing: 2px;
      color: var(--green);
      padding: 0.3rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: 99px;
      background: var(--green-glow);
    }

    .dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 6px var(--green);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('matrix') canvasRef!: ElementRef<HTMLCanvasElement>;
  private animId = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const cols = Math.floor(window.innerWidth / 20);
    const drops = Array(cols).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01アイウエオ10ABCDEF0123456789';

    const draw = () => {
      ctx.fillStyle = 'rgba(2,12,6,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px Share Tech Mono';
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      this.animId = requestAnimationFrame(draw);
    };
    draw();
  }

  ngOnDestroy() { cancelAnimationFrame(this.animId); }
}
