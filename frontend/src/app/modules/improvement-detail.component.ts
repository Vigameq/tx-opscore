import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExecutiveIntelligenceStoreService, ImprovementRecord } from '../services/executive-intelligence-store.service';

@Component({
  selector: 'app-improvement-detail',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './improvement-detail.component.html',
  styleUrl: './improvement-detail.component.scss'
})
export class ImprovementDetailComponent {
  improvement: ImprovementRecord | null = null;

  constructor(private route: ActivatedRoute, private executiveStore: ExecutiveIntelligenceStoreService) {
    this.route.paramMap.subscribe((params) => {
      const improvementId = params.get('improvementId') || '';
      this.improvement = this.executiveStore.getImprovement(improvementId) || null;
    });
  }

  createEco(): void {
    window.alert('ECO request created (mock).');
  }

  closeImprovement(): void {
    window.alert('Improvement marked as completed (mock).');
  }
}
