import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ProductionWorkflowStoreService, WorkOrderDetail } from '../services/production-workflow-store.service';

@Component({
  selector: 'app-work-order-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './work-order-detail.component.html',
  styleUrl: './work-order-detail.component.scss'
})
export class WorkOrderDetailComponent {
  activeTab: 'Summary' | 'Operations' | 'Material Issue' | 'Quality' | 'NCR / Rework' = 'Summary';
  workOrder: WorkOrderDetail;

  constructor(private route: ActivatedRoute, private productionStore: ProductionWorkflowStoreService) {
    const fallback = this.productionStore.getWorkOrders()[0];
    const initial = fallback ? this.productionStore.getWorkOrder(fallback.work_order_id) : undefined;
    this.workOrder = initial || {
      summary: {
        work_order_id: 'WO-NEW',
        sales_order_id: '',
        final_bom_id: '',
        product_family: '',
        quantity_planned: 0,
        quantity_completed: 0,
        status: 'READY_FOR_PRODUCTION',
        production_line: '',
        updated_at: new Date().toISOString().slice(0, 10)
      },
      operations: [],
      qc: {
        stage: 'IN_PROCESS',
        result: '',
        inspector: '',
        remarks: '',
        inspected_at: ''
      },
      ncrs: []
    };
    this.route.paramMap.subscribe((params) => {
      const workOrderId = params.get('workOrderId') || '';
      const match = this.productionStore.getWorkOrder(workOrderId);
      if (match) {
        this.workOrder = match;
      }
    });
  }

  setTab(tab: 'Summary' | 'Operations' | 'Material Issue' | 'Quality' | 'NCR / Rework'): void {
    this.activeTab = tab;
  }

  issueMaterial(): void {
    if (!this.workOrder) {
      return;
    }
    this.productionStore.updateStatus(this.workOrder.summary.work_order_id, 'PRODUCTION_STARTED');
    this.syncStatus('PRODUCTION_STARTED');
  }

  passQc(): void {
    if (!this.workOrder) {
      return;
    }
    const next = this.workOrder.summary.status === 'IN_PROCESS_QC' ? 'ASSEMBLY_COMPLETED' : 'FINAL_QC_PASSED';
    this.productionStore.updateStatus(this.workOrder.summary.work_order_id, next);
    this.syncStatus(next);
  }

  failQc(): void {
    if (!this.workOrder) {
      return;
    }
    this.productionStore.updateStatus(this.workOrder.summary.work_order_id, 'REWORK_REQUIRED');
    this.syncStatus('REWORK_REQUIRED');
  }

  markProductionComplete(): void {
    if (!this.workOrder) {
      return;
    }
    this.productionStore.updateStatus(this.workOrder.summary.work_order_id, 'PRODUCTION_COMPLETED');
    this.syncStatus('PRODUCTION_COMPLETED');
  }

  private syncStatus(status: WorkOrderDetail['summary']['status']): void {
    if (!this.workOrder) {
      return;
    }
    this.workOrder = {
      ...this.workOrder,
      summary: { ...this.workOrder.summary, status }
    };
  }
}
