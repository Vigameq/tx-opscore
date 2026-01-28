import { Injectable } from '@angular/core';

export type MrpState =
  | 'FBOM_RELEASED'
  | 'MRP_RUNNING'
  | 'MRP_COMPLETED'
  | 'PR_CREATED'
  | 'RFQ_SENT'
  | 'VENDOR_QUOTED'
  | 'PO_CREATED'
  | 'MATERIAL_ORDERED';

export interface MrpLine {
  item_code: string;
  gross_qty: number;
  on_hand_qty: number;
  on_order_qty: number;
  net_qty: number;
  required_date: string;
  source_type: string;
  preferred_vendor: string;
}

export interface MrpRun {
  mrpId: string;
  finalBomId: string;
  salesOrderId: string;
  status: MrpState;
  runBy: string;
  runTime: string;
  deliveryDate: string;
  lines: MrpLine[];
}

export interface PurchaseRequisition {
  prId: string;
  mrpId: string;
  status: MrpState;
  createdBy: string;
  createdAt: string;
}

export interface VendorRfq {
  rfqId: string;
  prId: string;
  status: MrpState;
  vendor: string;
}

interface InventorySnapshot {
  available_qty: number;
  incoming_qty: number;
  lead_time_days: number;
  preferred_vendor: string;
  source_type: string;
}

interface FinalBomItem {
  item_code: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ScmWorkflowStoreService {
  private mrpRuns: MrpRun[] = [
    {
      mrpId: 'MRP-2026-010',
      finalBomId: 'FBOM-2026-014',
      salesOrderId: 'SO-2026-021',
      status: 'FBOM_RELEASED',
      runBy: 'scm_lead',
      runTime: '',
      deliveryDate: '2026-04-15',
      lines: []
    }
  ];

  private prs: PurchaseRequisition[] = [];
  private rfqs: VendorRfq[] = [];

  private inventory: Record<string, InventorySnapshot> = {
    'FRAME-ORV3': { available_qty: 4, incoming_qty: 2, lead_time_days: 14, preferred_vendor: 'TIERX_FACTORY', source_type: 'MAKE' },
    'DR-FRONT-MESH': { available_qty: 6, incoming_qty: 4, lead_time_days: 10, preferred_vendor: 'VENDOR-A', source_type: 'BUY' },
    'PDU-MANAGED': { available_qty: 10, incoming_qty: 5, lead_time_days: 18, preferred_vendor: 'VENDOR-P', source_type: 'BUY' },
  };

  private finalBomItems: Record<string, FinalBomItem[]> = {
    'FBOM-2026-014': [
      { item_code: 'FRAME-ORV3', quantity: 12 },
      { item_code: 'DR-FRONT-MESH', quantity: 12 },
      { item_code: 'PDU-MANAGED', quantity: 24 },
    ]
  };

  getMrpRuns(): MrpRun[] {
    return this.mrpRuns;
  }

  getMrpRun(finalBomId: string): MrpRun {
    const existing = this.mrpRuns.find((run) => run.finalBomId === finalBomId);
    if (existing) {
      return existing;
    }
    const mrpId = `MRP-${new Date().getFullYear()}-${String(this.mrpRuns.length + 1).padStart(3, '0')}`;
    const run: MrpRun = {
      mrpId,
      finalBomId,
      salesOrderId: 'SO-NEW',
      status: 'FBOM_RELEASED',
      runBy: 'scm_lead',
      runTime: '',
      deliveryDate: new Date().toISOString().slice(0, 10),
      lines: []
    };
    this.mrpRuns = [run, ...this.mrpRuns];
    return run;
  }

  runMrp(finalBomId: string): MrpRun {
    const run = this.getMrpRun(finalBomId);
    const items = this.finalBomItems[finalBomId] || [];
    const delivery = new Date(run.deliveryDate);

    const lines: MrpLine[] = items
      .map((item) => {
        const inv = this.inventory[item.item_code] || {
          available_qty: 0,
          incoming_qty: 0,
          lead_time_days: 7,
          preferred_vendor: 'UNKNOWN',
          source_type: 'BUY'
        };
        const gross_qty = item.quantity;
        const net_qty = Math.max(0, gross_qty - (inv.available_qty + inv.incoming_qty));
        const requiredDate = new Date(delivery);
        requiredDate.setDate(requiredDate.getDate() - inv.lead_time_days);
        return {
          item_code: item.item_code,
          gross_qty,
          on_hand_qty: inv.available_qty,
          on_order_qty: inv.incoming_qty,
          net_qty,
          required_date: requiredDate.toISOString().slice(0, 10),
          source_type: inv.source_type,
          preferred_vendor: inv.preferred_vendor
        };
      })
      .filter((line) => line.net_qty > 0);

    const updated: MrpRun = {
      ...run,
      status: 'MRP_RUNNING',
      runBy: 'scm_lead',
      runTime: new Date().toISOString(),
      lines
    };
    this.mrpRuns = this.mrpRuns.map((item) => (item.finalBomId === finalBomId ? updated : item));
    return updated;
  }

  completeMrp(finalBomId: string): MrpRun {
    const run = this.getMrpRun(finalBomId);
    const updated = { ...run, status: 'MRP_COMPLETED' as MrpState };
    this.mrpRuns = this.mrpRuns.map((item) => (item.finalBomId === finalBomId ? updated : item));
    return updated;
  }

  createPr(mrpId: string): PurchaseRequisition {
    const existing = this.prs.find((pr) => pr.mrpId === mrpId);
    if (existing) {
      return existing;
    }
    const pr: PurchaseRequisition = {
      prId: `PR-${new Date().getFullYear()}-${String(this.prs.length + 1).padStart(3, '0')}`,
      mrpId,
      status: 'PR_CREATED',
      createdBy: 'scm_lead',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    this.prs = [pr, ...this.prs];
    this.updateMrpStatus(mrpId, 'PR_CREATED');
    return pr;
  }

  sendRfq(prId: string): VendorRfq {
    const existing = this.rfqs.find((rfq) => rfq.prId === prId);
    if (existing) {
      return existing;
    }
    const rfq: VendorRfq = {
      rfqId: `RFQ-${new Date().getFullYear()}-${String(this.rfqs.length + 1).padStart(3, '0')}`,
      prId,
      status: 'RFQ_SENT',
      vendor: 'VENDOR-A'
    };
    this.rfqs = [rfq, ...this.rfqs];
    this.updatePrStatus(prId, 'RFQ_SENT');
    return rfq;
  }

  captureVendorQuotes(prId: string): VendorRfq | undefined {
    const rfq = this.rfqs.find((item) => item.prId === prId);
    if (!rfq) {
      return undefined;
    }
    const updated = { ...rfq, status: 'VENDOR_QUOTED' as MrpState };
    this.rfqs = this.rfqs.map((item) => (item.prId === prId ? updated : item));
    this.updatePrStatus(prId, 'VENDOR_QUOTED');
    return updated;
  }

  approveVendor(prId: string): VendorRfq | undefined {
    const rfq = this.rfqs.find((item) => item.prId === prId);
    if (!rfq) {
      return undefined;
    }
    const updated = { ...rfq, status: 'PO_CREATED' as MrpState };
    this.rfqs = this.rfqs.map((item) => (item.prId === prId ? updated : item));
    this.updatePrStatus(prId, 'PO_CREATED');
    return updated;
  }

  confirmPoSent(prId: string): VendorRfq | undefined {
    const rfq = this.rfqs.find((item) => item.prId === prId);
    if (!rfq) {
      return undefined;
    }
    const updated = { ...rfq, status: 'MATERIAL_ORDERED' as MrpState };
    this.rfqs = this.rfqs.map((item) => (item.prId === prId ? updated : item));
    this.updatePrStatus(prId, 'MATERIAL_ORDERED');
    return updated;
  }

  getPrByMrpId(mrpId: string): PurchaseRequisition | undefined {
    return this.prs.find((pr) => pr.mrpId === mrpId);
  }

  getRfqByPrId(prId: string): VendorRfq | undefined {
    return this.rfqs.find((rfq) => rfq.prId === prId);
  }

  private updateMrpStatus(mrpId: string, status: MrpState): void {
    this.mrpRuns = this.mrpRuns.map((run) => (run.mrpId === mrpId ? { ...run, status } : run));
  }

  private updatePrStatus(prId: string, status: MrpState): void {
    this.prs = this.prs.map((pr) => (pr.prId === prId ? { ...pr, status } : pr));
    const pr = this.prs.find((item) => item.prId === prId);
    if (pr) {
      this.updateMrpStatus(pr.mrpId, status);
    }
  }
}
