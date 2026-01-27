import { Injectable } from '@angular/core';

export interface RequirementSnapshot {
  customer_name: string;
  opportunity_id: string;
  project_name: string;
  site_location: string;
  segment: string;
  product_families_required: string;
  rack_count: number;
  it_load_per_rack: number;
  redundancy: string;
  compliance: string;
  target_delivery_date: string;
  attachments: string[];
}

export interface PreBomRecord {
  id: string;
  project: string;
  status: string;
  owner: string;
  updatedAt: string;
  opportunityId: string;
  snapshot: RequirementSnapshot;
  finishedGoods?: PreBomFinishedGoodLine[];
}

export interface PreBomFinishedGoodLine {
  product_family: string;
  product_model: string;
  description: string;
  quantity: number;
  uom: string;
  config_summary?: string;
  target_unit_price?: number;
  target_lead_time_weeks?: number;
}

@Injectable({ providedIn: 'root' })
export class PreBomStoreService {
  private records: PreBomRecord[] = [];
  private snapshots: RequirementSnapshot[] = [];

  getPreBomRecords(): PreBomRecord[] {
    return this.records;
  }

  getRequirementSnapshots(): RequirementSnapshot[] {
    return this.snapshots;
  }

  addFromRequirement(snapshot: RequirementSnapshot): void {
    const existing = this.snapshots.find((item) => item.opportunity_id === snapshot.opportunity_id);
    if (!existing) {
      this.snapshots = [snapshot, ...this.snapshots];
    }

    const recordExists = this.records.some((record) => record.opportunityId === snapshot.opportunity_id);
    if (recordExists) {
      return;
    }

    const record: PreBomRecord = {
      id: `PBOM-${new Date().getFullYear()}-${String(this.records.length + 1).padStart(4, '0')}`,
      project: snapshot.project_name || 'Untitled project',
      status: 'DRAFT',
      owner: 'Sales',
      updatedAt: new Date().toISOString().slice(0, 10),
      opportunityId: snapshot.opportunity_id,
      snapshot,
    };

    this.records = [record, ...this.records];
  }

  updateStatusByOpportunity(opportunityId: string, status: string): void {
    this.records = this.records.map((record) =>
      record.opportunityId === opportunityId
        ? { ...record, status, updatedAt: new Date().toISOString().slice(0, 10) }
        : record
    );
  }

  updateRecordDetails(
    opportunityId: string,
    updates: { snapshot?: RequirementSnapshot; finishedGoods?: PreBomFinishedGoodLine[] }
  ): void {
    this.records = this.records.map((record) =>
      record.opportunityId === opportunityId
        ? {
            ...record,
            snapshot: updates.snapshot ?? record.snapshot,
            finishedGoods: updates.finishedGoods ?? record.finishedGoods,
            updatedAt: new Date().toISOString().slice(0, 10)
          }
        : record
    );
  }
}
