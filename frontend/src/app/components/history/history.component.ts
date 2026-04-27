import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordService, AnalysisResult } from '../../services/password.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  history: AnalysisResult[] = [];
  loading = true;
  error = '';

  constructor(private passwordService: PasswordService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.passwordService.getHistory().subscribe({
      next: (data) => { this.history = data; this.loading = false; },
      error: () => { this.error = 'Failed to load history.'; this.loading = false; }
    });
  }

  delete(id: string) {
    this.passwordService.deleteRecord(id).subscribe({
      next: () => { this.history = this.history.filter(h => h._id !== id); },
      error: () => { this.error = 'Failed to delete record.'; }
    });
  }

  badgeColor(level: string): string {
    return level === 'Weak' ? '#e74c3c' : level === 'Medium' ? '#f39c12' : '#27ae60';
  }

  get weakCount()   { return this.history.filter(h => h.strengthLevel === 'Weak').length; }
  get mediumCount() { return this.history.filter(h => h.strengthLevel === 'Medium').length; }
  get strongCount() { return this.history.filter(h => h.strengthLevel === 'Strong').length; }
}
