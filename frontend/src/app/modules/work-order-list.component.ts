import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductionWorkflowStoreService, WorkOrderSummary } from '../services/production-workflow-store.service';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './work-order-list.component.html',
  styleUrl: './work-order-list.component.scss'
})
export class WorkOrderListComponent {
  constructor(private productionStore: ProductionWorkflowStoreService) {}

  get workOrders(): WorkOrderSummary[] {
    return this.productionStore.getWorkOrders();
  }
}
