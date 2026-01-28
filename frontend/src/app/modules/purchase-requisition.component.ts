import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ScmWorkflowStoreService } from '../services/scm-workflow-store.service';

@Component({
  selector: 'app-purchase-requisition',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './purchase-requisition.component.html',
  styleUrl: './purchase-requisition.component.scss'
})
export class PurchaseRequisitionComponent {
  mrpId = '';
  mrpRun = this.scmStore.getMrpRuns()[0];
  pr = this.scmStore.getPrByMrpId(this.mrpRun?.mrpId || '');

  constructor(private route: ActivatedRoute, private scmStore: ScmWorkflowStoreService) {
    this.route.paramMap.subscribe((params) => {
      this.mrpId = params.get('mrpId') || this.mrpRun?.mrpId || '';
      this.mrpRun = this.scmStore.getMrpRuns().find((run) => run.mrpId === this.mrpId) || this.mrpRun;
      this.pr = this.scmStore.getPrByMrpId(this.mrpId);
    });
  }

  canCreatePr(): boolean {
    return !!this.mrpRun && this.mrpRun.status === 'MRP_COMPLETED';
  }

  createPr(): void {
    if (!this.mrpRun) {
      return;
    }
    this.pr = this.scmStore.createPr(this.mrpRun.mrpId);
  }
}
