import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor],
  templateUrl: './feedback-form.component.html',
  styleUrl: './feedback-form.component.scss'
})
export class FeedbackFormComponent {
  secureToken = '';
  form = {
    designSuitability: 0,
    customizationSupport: 0,
    materialQuality: 0,
    buildFinish: 0,
    responsiveness: 0,
    issueResolution: 0,
    overallSatisfaction: 0,
    npsScore: 0,
    comments: ''
  };

  constructor(route: ActivatedRoute) {
    route.paramMap.subscribe((params) => {
      this.secureToken = params.get('secureToken') || '';
    });
  }

  submitFeedback(): void {
    window.alert('Feedback submitted. Thank you!');
  }
}
