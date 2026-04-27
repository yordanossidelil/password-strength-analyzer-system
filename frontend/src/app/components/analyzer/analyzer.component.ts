import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordService, AnalysisResult } from '../../services/password.service';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.scss']
})
export class AnalyzerComponent {
  password = '';
  showPassword = false;
  result: AnalysisResult | null = null;
  loading = false;
  error = '';
  scanLines = Array(6).fill(0);

  constructor(private passwordService: PasswordService) {}

  get strengthPercent(): number {
    if (!this.result) return 0;
    return this.result.strengthLevel === 'Weak' ? 28
         : this.result.strengthLevel === 'Medium' ? 62 : 100;
  }

  get strengthConfig(): { label: string; color: string; bg: string; icon: string; threat: string } {
    if (!this.result) return { label: '', color: '', bg: '', icon: '', threat: '' };
    const map: any = {
      Weak:   { label: 'CRITICAL RISK',   color: '#ff4757', bg: 'rgba(255,71,87,0.1)',   icon: '☠', threat: 'CRACKABLE IN < 1 SECOND' },
      Medium: { label: 'MODERATE RISK',   color: '#ffa502', bg: 'rgba(255,165,2,0.1)',   icon: '⚠', threat: 'CRACKABLE IN HOURS–DAYS'  },
      Strong: { label: 'SECURE',          color: '#00ff88', bg: 'rgba(0,255,136,0.08)',  icon: '✓', threat: 'ESTIMATED CRACK: CENTURIES' }
    };
    return map[this.result.strengthLevel];
  }

  get checks() {
    if (!this.result) return [];
    return [
      { label: 'MIN LENGTH (8+)',       pass: this.result.passwordLength >= 8,  detail: `${this.result.passwordLength} chars` },
      { label: 'UPPERCASE [A-Z]',       pass: this.result.hasUppercase,          detail: this.result.hasUppercase ? 'FOUND' : 'MISSING' },
      { label: 'LOWERCASE [a-z]',       pass: this.result.hasLowercase,          detail: this.result.hasLowercase ? 'FOUND' : 'MISSING' },
      { label: 'NUMBERS [0-9]',         pass: this.result.hasNumbers,            detail: this.result.hasNumbers ? 'FOUND' : 'MISSING' },
      { label: 'SPECIAL CHARS [!@#$]',  pass: this.result.hasSpecialCharacters,  detail: this.result.hasSpecialCharacters ? 'FOUND' : 'MISSING' },
    ];
  }

  analyze() {
    if (!this.password.trim()) return;
    this.loading = true;
    this.error = '';
    this.result = null;
    this.passwordService.analyze(this.password).subscribe({
      next: (res) => { this.result = res; this.loading = false; },
      error: () => { this.error = 'CONNECTION FAILED — BACKEND OFFLINE'; this.loading = false; }
    });
  }

  reset() { this.password = ''; this.result = null; this.error = ''; }
}
