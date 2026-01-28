import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ScmWorkflowStoreService } from '../services/scm-workflow-store.service';

@Component({
  selector: 'app-rfq-management',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './rfq-management.component.html',
  styleUrl: './rfq-management.component.scss'
})
export class RfqManagementComponent {
  prId = '';
  pr = this.scmStore.getPrByMrpId('MRP-2026-010');
  rfq = this.pr ? this.scmStore.getRfqByPrId(this.pr.prId) : undefined;

  vendorQuotes = [
    { vendor: 'VENDOR-A', item_code: 'FRAME-ORV3', quoted_price: 11800, lead_time: 14, rating: 'A' },
    { vendor: 'VENDOR-B', item_code: 'FRAME-ORV3', quoted_price: 12100, lead_time: 12, rating: 'B+' },
  ];

  constructor(private route: ActivatedRoute, private scmStore: ScmWorkflowStoreService) {
    this.route.paramMap.subscribe((params) => {
      this.prId = params.get('prId') || this.pr?.prId || '';
      if (this.prId) {
        this.pr = this.scmStore.getPrByMrpId(this.prId) || { prId: this.prId, mrpId: '', status: 'PR_CREATED', createdBy: '', createdAt: '' };
        this.rfq = this.scmStore.getRfqByPrId(this.prId);
      }
    });
  }

  sendRfq(): void {
    if (!this.pr) {
      return;
    }
    this.rfq = this.scmStore.sendRfq(this.pr.prId);
  }

  captureQuotes(): void {
    if (!this.pr) {
      return;
    }
    this.rfq = this.scmStore.captureVendorQuotes(this.pr.prId);
  }

  approveVendor(): void {
    if (!this.pr) {
      return;
    }
    this.rfq = this.scmStore.approveVendor(this.pr.prId);
  }

  confirmPoSent(): void {
    if (!this.pr) {
      return;
    }
    this.rfq = this.scmStore.confirmPoSent(this.pr.prId);
  }

  canSendRfq(): boolean {
    return this.pr?.status === 'PR_CREATED';
  }

  canCaptureQuotes(): boolean {
    return this.pr?.status === 'RFQ_SENT';
  }

  canApproveVendor(): boolean {
    return this.pr?.status === 'VENDOR_QUOTED';
  }

  canConfirmPo(): boolean {
    return this.pr?.status === 'PO_CREATED';
  }
}
