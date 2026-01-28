import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

type Role = 'ENGINEERING' | 'ENGINEERING_LEAD' | 'SCM' | 'PLANNING' | 'PRODUCTION' | 'ADMIN';
type State =
  | 'ENGINEERING_RELEASE_PENDING'
  | 'ENGINEERING_IN_PROGRESS'
  | 'ENGINEERING_REVIEW'
  | 'ENGINEERING_FROZEN'
  | 'FBOM_RELEASED';

interface FbomItem {
  item_code: string;
  item_name: string;
  material: string;
  specification: string;
  quantity: number;
  uom: string;
  source_type: string;
  preferred_vendor: string;
  routing_required: boolean;
  qc_required: boolean;
}

interface AuditLog {
  date: string;
  action: string;
  from_status: string;
  to_status: string;
  performed_by: string;
  remarks: string;
}

@Component({
  selector: 'app-final-bom-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './final-bom-detail.component.html',
  styleUrl: './final-bom-detail.component.scss'
})
export class FinalBomDetailComponent {
  finalBomId = 'FBOM-2026-014';
  activeTab: 'Summary' | 'FBOM Structure' | 'Engineering Review' | 'Workflow & Audit' = 'Summary';
  currentRole: Role = 'ENGINEERING';
  currentState: State = 'ENGINEERING_RELEASE_PENDING';

  summary = {
    final_bom_id: 'FBOM-2026-014',
    sales_order_id: 'SO-2026-021',
    pre_bom_id: 'PBOM-2026-0007',
    status: 'ENGINEERING_RELEASE_PENDING',
    revision: 'V1'
  };

  fbomItems: FbomItem[] = [
    {
      item_code: 'FRAME-ORV3',
      item_name: 'Rack Frame Assembly',
      material: 'MS',
      specification: '2.0mm, powder coated',
      quantity: 1,
      uom: 'Nos',
      source_type: 'MAKE',
      preferred_vendor: 'TIERX_FACTORY',
      routing_required: true,
      qc_required: true
    },
    {
      item_code: 'DR-FRONT-MESH',
      item_name: 'Front Perforated Door',
      material: 'Steel',
      specification: '80% airflow, combo lock',
      quantity: 1,
      uom: 'Nos',
      source_type: 'BUY',
      preferred_vendor: 'VENDOR-A',
      routing_required: true,
      qc_required: true
    }
  ];

  reviewComments = '';

  auditLog: AuditLog[] = [
    {
      date: '2026-01-23',
      action: 'START_ENGINEERING',
      from_status: 'ENGINEERING_RELEASE_PENDING',
      to_status: 'ENGINEERING_IN_PROGRESS',
      performed_by: 'eng_01',
      remarks: 'Loaded Pre-BOM and created FBOM draft.'
    }
  ];

  constructor(route: ActivatedRoute) {
    route.paramMap.subscribe((params) => {
      this.finalBomId = params.get('finalBomId') || this.summary.final_bom_id;
      this.summary = { ...this.summary, final_bom_id: this.finalBomId };
    });
  }

  setTab(tab: 'Summary' | 'FBOM Structure' | 'Engineering Review' | 'Workflow & Audit'): void {
    this.activeTab = tab;
  }

  canStartEngineering(): boolean {
    return (
      (this.currentRole === 'ENGINEERING' || this.currentRole === 'ENGINEERING_LEAD') &&
      this.currentState === 'ENGINEERING_RELEASE_PENDING'
    );
  }

  canSubmitForReview(): boolean {
    return this.currentRole === 'ENGINEERING' && this.currentState === 'ENGINEERING_IN_PROGRESS';
  }

  canApproveEngineering(): boolean {
    return this.currentRole === 'ENGINEERING_LEAD' && this.currentState === 'ENGINEERING_REVIEW';
  }

  canReleaseFbom(): boolean {
    return (this.currentRole === 'ENGINEERING_LEAD' || this.currentRole === 'ADMIN') &&
      this.currentState === 'ENGINEERING_FROZEN';
  }

  startEngineering(): void {
    if (!this.canStartEngineering()) {
      return;
    }
    this.transition('START_ENGINEERING', 'ENGINEERING_IN_PROGRESS', 'Engineering work started.');
  }

  submitForReview(): void {
    if (!this.canSubmitForReview()) {
      return;
    }
    this.transition('SUBMIT_FOR_ENGINEERING_REVIEW', 'ENGINEERING_REVIEW', 'Submitted for engineering review.');
  }

  approveEngineering(): void {
    if (!this.canApproveEngineering()) {
      return;
    }
    this.transition('APPROVE_ENGINEERING', 'ENGINEERING_FROZEN', 'Engineering frozen.');
  }

  releaseFbom(): void {
    if (!this.canReleaseFbom()) {
      return;
    }
    this.transition('RELEASE_FBOM', 'FBOM_RELEASED', 'Final BOM released.');
  }

  rejectEngineering(): void {
    if (this.currentRole !== 'ENGINEERING_LEAD' || this.currentState !== 'ENGINEERING_REVIEW') {
      return;
    }
    this.transition('REJECT_ENGINEERING', 'ENGINEERING_IN_PROGRESS', 'Returned to engineering for changes.');
  }

  addFbomItem(): void {
    this.fbomItems = [
      ...this.fbomItems,
      {
        item_code: '',
        item_name: '',
        material: '',
        specification: '',
        quantity: 1,
        uom: 'Nos',
        source_type: 'MAKE',
        preferred_vendor: '',
        routing_required: true,
        qc_required: true
      }
    ];
  }

  private transition(action: string, nextState: State, remarks: string): void {
    const logEntry: AuditLog = {
      date: new Date().toISOString().slice(0, 10),
      action,
      from_status: this.currentState,
      to_status: nextState,
      performed_by: this.currentRole,
      remarks
    };
    this.currentState = nextState;
    this.summary = { ...this.summary, status: nextState };
    this.auditLog = [logEntry, ...this.auditLog];
  }
}
