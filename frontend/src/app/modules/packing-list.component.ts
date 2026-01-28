import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogisticsWorkflowStoreService } from '../services/logistics-workflow-store.service';

@Component({
  selector: 'app-packing-list',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './packing-list.component.html',
  styleUrl: './packing-list.component.scss'
})
export class PackingListComponent {
  constructor(private logisticsStore: LogisticsWorkflowStoreService) {}

  get packingHeaders() {
    return this.logisticsStore.getPackingHeaders();
  }

  getShipmentLink(packingId: string): string {
    const shipment = this.logisticsStore.getShipmentByPacking(packingId);
    return shipment?.shipment_id || packingId;
  }
}
