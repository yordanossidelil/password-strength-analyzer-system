import { Routes } from '@angular/router';
import { AnalyzerComponent } from './components/analyzer/analyzer.component';
import { HistoryComponent }  from './components/history/history.component';

export const routes: Routes = [
  { path: '',        component: AnalyzerComponent },
  { path: 'history', component: HistoryComponent  },
  { path: '**',      redirectTo: '' }
];
