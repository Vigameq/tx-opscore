import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ScmWorkflowStoreService } from '../services/scm-workflow-store.service';

@Component({
  selector: 'app-mrp-run',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './mrp-run.component.html',
  styleUrl: './mrp-run.component.scss'
})
export class MrpRunComponent {
  finalBomId = '';
  mrpRun = this.scmStore.getMrpRun('FBOM-2026-014');

  constructor(private route: ActivatedRoute, private scmStore: ScmWorkflowStoreService) {
    this.route.paramMap.subscribe((params) => {
      this.finalBomId = params.get('finalBomId') || 'FBOM-2026-014';
      this.mrpRun = this.scmStore.getMrpRun(this.finalBomId);
    });
  }

  runMrp(): void {
    this.mrpRun = this.scmStore.runMrp(this.finalBomId);
  }

  completeMrp(): void {
    this.mrpRun = this.scmStore.completeMrp(this.finalBomId);
  }

  canRunMrp(): boolean {
    return this.mrpRun.status === 'FBOM_RELEASED';
  }

  canCompleteMrp(): boolean {
    return this.mrpRun.status === 'MRP_RUNNING';
  }
}
