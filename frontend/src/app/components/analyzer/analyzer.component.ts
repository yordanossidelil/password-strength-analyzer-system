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

  constructor(private passwordService: PasswordService) {}

  get strengthPercent(): number {
    if (!this.result) return 0;
    return this.result.strengthLevel === 'Weak' ? 33
         : this.result.strengthLevel === 'Medium' ? 66 : 100;
  }

  get strengthColor(): string {
    if (!this.result) return '#ccc';
    return this.result.strengthLevel === 'Weak' ? '#e74c3c'
         : this.result.strengthLevel === 'Medium' ? '#f39c12' : '#27ae60';
  }

  analyze() {
    if (!this.password.trim()) return;
    this.loading = true;
    this.error = '';
    this.passwordService.analyze(this.password).subscribe({
      next: (res) => { this.result = res; this.loading = false; },
      error: () => { this.error = 'Failed to connect to server.'; this.loading = false; }
    });
  }

  reset() {
    this.password = '';
    this.result = null;
    this.error = '';
  }
}
