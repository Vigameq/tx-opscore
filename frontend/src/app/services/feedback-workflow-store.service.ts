import { Injectable } from '@angular/core';

export type FeedbackState =
  | 'FEEDBACK_PENDING'
  | 'FEEDBACK_SENT'
  | 'FEEDBACK_RECEIVED'
  | 'INTERNAL_REVIEW'
  | 'ACTION_IN_PROGRESS'
  | 'FEEDBACK_CLOSED';

export interface FeedbackHeader {
  feedback_id: string;
  sales_order_id: string;
  customer_id: string;
  project_name: string;
  status: FeedbackState;
  csat_score: number;
  nps_score: number;
  submitted_at: string;
  closed_at: string;
}

export interface FeedbackResponse {
  category: string;
  question: string;
  rating: number;
  comments: string;
}

export interface FeedbackDetail {
  header: FeedbackHeader;
  responses: FeedbackResponse[];
  internal_review: {
    root_cause: string;
    remarks: string;
    action_required: boolean;
  };
  actions: Array<{
    action_id: string;
    description: string;
    assigned_to: string;
    status: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class FeedbackWorkflowStoreService {
  private feedbacks: FeedbackDetail[] = [
    {
      header: {
        feedback_id: 'FBK-2026-004',
        sales_order_id: 'SO-2026-021',
        customer_id: 'CUST-1024',
        project_name: 'BLR-DC-Phase1',
        status: 'INTERNAL_REVIEW',
        csat_score: 3.8,
        nps_score: 7,
        submitted_at: '2026-01-26',
        closed_at: ''
      },
      responses: [
        { category: 'PRODUCT QUALITY', question: 'Material quality', rating: 4, comments: 'Good finish' },
        { category: 'SUPPORT & SERVICE', question: 'Responsiveness', rating: 3, comments: 'Slight delays' }
      ],
      internal_review: {
        root_cause: '',
        remarks: '',
        action_required: true
      },
      actions: [
        { action_id: 'ACT-401', description: 'Improve packaging SOP', assigned_to: 'Production', status: 'Open' }
      ]
    }
  ];

  getFeedbackHeaders(): FeedbackHeader[] {
    return this.feedbacks.map((item) => item.header);
  }

  getFeedback(feedbackId: string): FeedbackDetail | undefined {
    return this.feedbacks.find((item) => item.header.feedback_id === feedbackId);
  }

  updateStatus(feedbackId: string, status: FeedbackState): void {
    this.feedbacks = this.feedbacks.map((item) =>
      item.header.feedback_id === feedbackId
        ? { ...item, header: { ...item.header, status } }
        : item
    );
  }
}
