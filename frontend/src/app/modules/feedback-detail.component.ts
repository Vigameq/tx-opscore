import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackWorkflowStoreService, FeedbackDetail } from '../services/feedback-workflow-store.service';

@Component({
  selector: 'app-feedback-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './feedback-detail.component.html',
  styleUrl: './feedback-detail.component.scss'
})
export class FeedbackDetailComponent {
  activeTab: 'Customer Responses' | 'Internal Review' | 'Improvement Actions' = 'Customer Responses';
  feedback: FeedbackDetail | null = null;

  constructor(private route: ActivatedRoute, private feedbackStore: FeedbackWorkflowStoreService) {
    this.route.paramMap.subscribe((params) => {
      const feedbackId = params.get('feedbackId') || '';
      this.feedback = this.feedbackStore.getFeedback(feedbackId) || null;
    });
  }

  setTab(tab: 'Customer Responses' | 'Internal Review' | 'Improvement Actions'): void {
    this.activeTab = tab;
  }

  startImprovement(): void {
    if (!this.feedback) {
      return;
    }
    this.feedbackStore.updateStatus(this.feedback.header.feedback_id, 'ACTION_IN_PROGRESS');
    this.feedback = this.feedbackStore.getFeedback(this.feedback.header.feedback_id) || null;
  }
}
