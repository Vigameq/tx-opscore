import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExecutiveIntelligenceStoreService } from '../services/executive-intelligence-store.service';

@Component({
  selector: 'app-improvement-tracker',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './improvement-tracker.component.html',
  styleUrl: './improvement-tracker.component.scss'
})
export class ImprovementTrackerComponent {
  constructor(private executiveStore: ExecutiveIntelligenceStoreService) {}

  get improvements() {
    return this.executiveStore.getImprovements();
  }
}
