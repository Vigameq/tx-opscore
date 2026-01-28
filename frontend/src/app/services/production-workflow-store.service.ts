import { Injectable } from '@angular/core';

export type WorkOrderState =
  | 'READY_FOR_PRODUCTION'
  | 'MATERIAL_ISSUED'
  | 'PRODUCTION_STARTED'
  | 'IN_PROCESS_QC'
  | 'ASSEMBLY_COMPLETED'
  | 'FINAL_QC_PENDING'
  | 'FINAL_QC_PASSED'
  | 'REWORK_REQUIRED'
  | 'PRODUCTION_COMPLETED';

export interface WorkOrderOperation {
  operation_seq: number;
  operation_name: string;
  status: string;
  operator: string;
}

export interface WorkOrderSummary {
  work_order_id: string;
  sales_order_id: string;
  final_bom_id: string;
  product_family: string;
  quantity_planned: number;
  quantity_completed: number;
  status: WorkOrderState;
  production_line: string;
  updated_at: string;
}

export interface QcCheckpoint {
  stage: 'IN_PROCESS' | 'FINAL';
  result: 'PASS' | 'FAIL' | '';
  inspector: string;
  remarks: string;
  inspected_at: string;
}

export interface NcrRecord {
  ncr_id: string;
  severity: string;
  status: string;
}

export interface WorkOrderDetail {
  summary: WorkOrderSummary;
  operations: WorkOrderOperation[];
  qc: QcCheckpoint;
  ncrs: NcrRecord[];
}

@Injectable({ providedIn: 'root' })
export class ProductionWorkflowStoreService {
  private workOrders: WorkOrderDetail[] = [
    {
      summary: {
        work_order_id: 'WO-2026-041',
        sales_order_id: 'SO-2026-021',
        final_bom_id: 'FBOM-2026-014',
        product_family: 'Rack System',
        quantity_planned: 42,
        quantity_completed: 12,
        status: 'PRODUCTION_STARTED',
        production_line: 'Line A',
        updated_at: '2026-01-27'
      },
      operations: [
        { operation_seq: 10, operation_name: 'Frame build', status: 'In progress', operator: 'Operator A' },
        { operation_seq: 20, operation_name: 'Paint & finish', status: 'Queued', operator: 'Operator B' },
        { operation_seq: 30, operation_name: 'Assembly', status: 'Queued', operator: 'Operator C' }
      ],
      qc: {
        stage: 'IN_PROCESS',
        result: '',
        inspector: 'QA-01',
        remarks: '',
        inspected_at: ''
      },
      ncrs: []
    },
    {
      summary: {
        work_order_id: 'WO-2026-045',
        sales_order_id: 'SO-2026-018',
        final_bom_id: 'FBOM-2026-015',
        product_family: 'PDU',
        quantity_planned: 84,
        quantity_completed: 84,
        status: 'FINAL_QC_PENDING',
        production_line: 'Line B',
        updated_at: '2026-01-26'
      },
      operations: [
        { operation_seq: 10, operation_name: 'Assembly', status: 'Completed', operator: 'Operator D' },
        { operation_seq: 20, operation_name: 'Functional test', status: 'Completed', operator: 'Operator E' }
      ],
      qc: {
        stage: 'FINAL',
        result: '',
        inspector: 'QA-02',
        remarks: '',
        inspected_at: ''
      },
      ncrs: [
        { ncr_id: 'NCR-1003', severity: 'MINOR', status: 'Open' }
      ]
    }
  ];

  getWorkOrders(): WorkOrderSummary[] {
    return this.workOrders.map((wo) => wo.summary);
  }

  getWorkOrder(workOrderId: string): WorkOrderDetail | undefined {
    return this.workOrders.find((wo) => wo.summary.work_order_id === workOrderId);
  }

  updateStatus(workOrderId: string, status: WorkOrderState): void {
    this.workOrders = this.workOrders.map((wo) =>
      wo.summary.work_order_id === workOrderId
        ? {
            ...wo,
            summary: { ...wo.summary, status, updated_at: new Date().toISOString().slice(0, 10) }
          }
        : wo
    );
  }
}
