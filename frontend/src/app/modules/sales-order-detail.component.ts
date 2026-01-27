import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-order-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './sales-order-detail.component.html',
  styleUrl: './sales-order-detail.component.scss'
})
export class SalesOrderDetailComponent {
  salesOrderId = '';

  header = {
    title: 'Sales Order',
    subtitle: 'Order Execution Control Center'
  };

  orderSummary = {
    sales_order_id: 'SO-2026-021',
    customer_name: 'Nimbus Logistics',
    project_name: 'HYD-DC-Expansion',
    quotation_id: 'QT-88977',
    po_number: 'PO-7712',
    order_value: '₹4,200,000',
    current_status: 'ENGINEERING_FROZEN'
  };

  orderLines = [
    { product_family: 'Rack', product_model: 'ORV3', description: 'Rack enclosure system', quantity: 28, uom: 'Nos', unit_price: '₹120,000', total_price: '₹3,360,000' },
    { product_family: 'PDU', product_model: 'Managed', description: 'Smart PDU', quantity: 56, uom: 'Nos', unit_price: '₹15,000', total_price: '₹840,000' }
  ];

  engineeringRelease = {
    scope_verified: true,
    drawings_confirmed: true,
    bom_ready: false,
    engineering_notes: ''
  };

  finalBom = {
    final_bom_id: 'FBOM-2026-014',
    bom_status: 'Frozen'
  };

  planning = {
    mrp_ready: true,
    planning_notes: ''
  };

  workflow = {
    current_owner: 'SCM',
    pending_with: 'Planning'
  };

  workflowLog = [
    { date: '2026-01-18', action: 'APPROVE_PO', from_status: 'PO_VERIFIED', to_status: 'SALES_ORDER_CREATED', performed_by: 'Finance', remarks: 'PO verified' },
    { date: '2026-01-20', action: 'FREEZE_ENGINEERING', from_status: 'ENGINEERING_RELEASE_PENDING', to_status: 'ENGINEERING_FROZEN', performed_by: 'Engineering Lead', remarks: 'Drawings confirmed' }
  ];

  currentRole = 'ENGINEERING';
  currentState = 'ENGINEERING_FROZEN';

  constructor(route: ActivatedRoute) {
    route.paramMap.subscribe((params) => {
      this.salesOrderId = params.get('salesOrderId') || this.orderSummary.sales_order_id;
      this.orderSummary = { ...this.orderSummary, sales_order_id: this.salesOrderId };
    });
  }

  canRequestFreeze(): boolean {
    return this.currentRole === 'ENGINEERING' && this.currentState === 'SALES_ORDER_CREATED';
  }

  canFreezeEngineering(): boolean {
    return this.currentRole === 'ENGINEERING_LEAD' && this.currentState === 'ENGINEERING_RELEASE_PENDING';
  }

  canReleaseMrp(): boolean {
    return (this.currentRole === 'SCM' || this.currentRole === 'PLANNING') && this.currentState === 'ENGINEERING_FROZEN';
  }
}
