import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExecutiveIntelligenceStoreService } from '../services/executive-intelligence-store.service';

@Component({
  selector: 'app-executive-dashboard',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './executive-dashboard.component.html',
  styleUrl: './executive-dashboard.component.scss'
})
export class ExecutiveDashboardComponent {
  constructor(private executiveStore: ExecutiveIntelligenceStoreService) {}

  get snapshot() {
    return this.executiveStore.getSnapshot();
  }

  get topIssues() {
    return this.executiveStore.getTopIssues();
  }
}
