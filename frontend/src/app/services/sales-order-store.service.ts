import { Injectable } from '@angular/core';

export interface SalesOrderEntry {
  id: string;
  quotationId: string;
  opportunityId: string;
  customer: string;
  project: string;
  value: number;
  status: string;
  owner: string;
  delivery: string;
}

@Injectable({ providedIn: 'root' })
export class SalesOrderStoreService {
  private salesOrders: SalesOrderEntry[] = [
    {
      id: 'SO-2026-018',
      quotationId: 'QT-88991',
      opportunityId: 'OPP-56789',
      customer: 'ABC Data Centers',
      project: 'BLR-DC-Phase1',
      value: 12500000,
      status: 'PO_RECEIVED',
      owner: 'Sales',
      delivery: '2026-04-15'
    },
    {
      id: 'SO-2026-021',
      quotationId: 'QT-88977',
      opportunityId: 'OPP-88977',
      customer: 'Nimbus Logistics',
      project: 'HYD-DC-Expansion',
      value: 4200000,
      status: 'ENGINEERING_FROZEN',
      owner: 'Engineering',
      delivery: '2026-05-02'
    },
    {
      id: 'SO-2026-027',
      quotationId: 'QT-88912',
      opportunityId: 'OPP-88912',
      customer: 'Helios Energy',
      project: 'DEL-Edge-Cluster',
      value: 9750000,
      status: 'READY_FOR_MRP',
      owner: 'SCM',
      delivery: '2026-03-28'
    }
  ];

  getSalesOrders(): SalesOrderEntry[] {
    return this.salesOrders;
  }

  upsertFromQuotation(payload: {
    quotationId: string;
    opportunityId: string;
    customer: string;
    project: string;
    value: number;
    delivery?: string;
  }): void {
    const existingIndex = this.salesOrders.findIndex(
      (order) => order.quotationId === payload.quotationId
    );

    const entry: SalesOrderEntry = {
      id:
        existingIndex >= 0
          ? this.salesOrders[existingIndex].id
          : `SO-${new Date().getFullYear()}-${String(this.salesOrders.length + 1).padStart(3, '0')}`,
      quotationId: payload.quotationId,
      opportunityId: payload.opportunityId,
      customer: payload.customer,
      project: payload.project,
      value: payload.value,
      status: 'QUOTATION_ACCEPTED',
      owner: 'Sales',
      delivery: payload.delivery || new Date().toISOString().slice(0, 10)
    };

    if (existingIndex >= 0) {
      this.salesOrders = this.salesOrders.map((order, index) =>
        index === existingIndex ? entry : order
      );
      return;
    }

    this.salesOrders = [entry, ...this.salesOrders];
  }
}
