import { Injectable } from '@angular/core';

export interface ExecutiveKpiSnapshot {
  total_orders: number;
  on_time_delivery_pct: number;
  avg_cycle_days: number;
  delayed_orders: number;
  in_production: number;
  in_transit: number;
  final_qc_pass_rate: number;
  ncr_count: number;
  rework_rate_pct: number;
  avg_csat_score: number;
  nps_score: number;
  low_feedback_count: number;
  repeat_customer_pct: number;
  reference_customers: number;
}

export interface TopIssue {
  issue_category: string;
  product_model: string;
  count: number;
  status: string;
}

export interface ImprovementRecord {
  improvement_id: string;
  product_model: string;
  issue_category: string;
  assigned_team: string;
  status: string;
  source_type: string;
  issue_description: string;
  improvement_action: string;
}

@Injectable({ providedIn: 'root' })
export class ExecutiveIntelligenceStoreService {
  private snapshot: ExecutiveKpiSnapshot = {
    total_orders: 128,
    on_time_delivery_pct: 92.4,
    avg_cycle_days: 46.3,
    delayed_orders: 8,
    in_production: 12,
    in_transit: 5,
    final_qc_pass_rate: 96.1,
    ncr_count: 6,
    rework_rate_pct: 2.8,
    avg_csat_score: 4.2,
    nps_score: 38,
    low_feedback_count: 3,
    repeat_customer_pct: 64,
    reference_customers: 7
  };

  private topIssues: TopIssue[] = [
    { issue_category: 'QUALITY', product_model: 'ORV3 Rack', count: 3, status: 'Open' },
    { issue_category: 'DELIVERY', product_model: 'PDU Managed', count: 2, status: 'In Progress' },
    { issue_category: 'DESIGN', product_model: 'Containment Kit', count: 1, status: 'Closed' }
  ];

  private improvements: ImprovementRecord[] = [
    {
      improvement_id: 'IMP-2026-010',
      product_model: 'ORV3 Rack',
      issue_category: 'QUALITY',
      assigned_team: 'QA',
      status: 'In Progress',
      source_type: 'FEEDBACK',
      issue_description: 'Minor paint defects in rack frames.',
      improvement_action: 'Update paint booth calibration SOP.'
    },
    {
      improvement_id: 'IMP-2026-011',
      product_model: 'PDU Managed',
      issue_category: 'DELIVERY',
      assigned_team: 'Logistics',
      status: 'Open',
      source_type: 'DELIVERY',
      issue_description: 'Delayed shipment due to transporter mismatch.',
      improvement_action: 'Introduce pre-dispatch carrier checklist.'
    }
  ];

  getSnapshot(): ExecutiveKpiSnapshot {
    return this.snapshot;
  }

  getTopIssues(): TopIssue[] {
    return this.topIssues;
  }

  getImprovements(): ImprovementRecord[] {
    return this.improvements;
  }

  getImprovement(improvementId: string): ImprovementRecord | undefined {
    return this.improvements.find((item) => item.improvement_id === improvementId);
  }
}
