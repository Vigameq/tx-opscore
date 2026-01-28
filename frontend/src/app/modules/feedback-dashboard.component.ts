import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeedbackWorkflowStoreService } from '../services/feedback-workflow-store.service';

@Component({
  selector: 'app-feedback-dashboard',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './feedback-dashboard.component.html',
  styleUrl: './feedback-dashboard.component.scss'
})
export class FeedbackDashboardComponent {
  constructor(private feedbackStore: FeedbackWorkflowStoreService) {}

  get feedbacks() {
    return this.feedbackStore.getFeedbackHeaders();
  }
}
