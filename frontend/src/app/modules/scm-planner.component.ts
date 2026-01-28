import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScmWorkflowStoreService } from '../services/scm-workflow-store.service';

@Component({
  selector: 'app-scm-planner',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './scm-planner.component.html',
  styleUrl: './scm-planner.component.scss'
})
export class ScmPlannerComponent {
  constructor(private scmStore: ScmWorkflowStoreService) {}

  get mrpRuns() {
    return this.scmStore.getMrpRuns();
  }

  get awaitingPrCount(): number {
    return this.mrpRuns.filter((run) => run.status === 'MRP_COMPLETED').length;
  }

  get rfqSentCount(): number {
    return this.mrpRuns.filter((run) => run.status === 'RFQ_SENT').length;
  }

  formatRunTime(runTime: string): string {
    if (!runTime) {
      return '—';
    }
    return runTime.slice(0, 10);
  }

  getRfqId(runId: string): string {
    const pr = this.scmStore.getPrByMrpId(runId);
    return pr?.prId || runId;
  }
}
