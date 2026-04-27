import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalysisResult {
  _id: string;
  passwordLength: number;
  strengthLevel: 'Weak' | 'Medium' | 'Strong';
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialCharacters: boolean;
  suggestions: string[];
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private api = '/api';

  constructor(private http: HttpClient) {}

  analyze(password: string): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(`${this.api}/analyze-password`, { password });
  }

  getHistory(): Observable<AnalysisResult[]> {
    return this.http.get<AnalysisResult[]>(`${this.api}/password-history`);
  }

  deleteRecord(id: string): Observable<any> {
    return this.http.delete(`${this.api}/password-history/${id}`);
  }
}
