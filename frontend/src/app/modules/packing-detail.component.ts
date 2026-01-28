import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { LogisticsWorkflowStoreService } from '../services/logistics-workflow-store.service';

@Component({
  selector: 'app-packing-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './packing-detail.component.html',
  styleUrl: './packing-detail.component.scss'
})
export class PackingDetailComponent {
  packingId = '';
  packing = this.logisticsStore.getPackingHeaders()[0];

  packingLines = [
    { box_id: 'BOX-01', item_code: 'FRAME-ORV3', serial_number: 'SR-1001', quantity: 1, weight_kg: 40, dimensions: '1200x600x2000' },
    { box_id: 'BOX-02', item_code: 'DR-FRONT-MESH', serial_number: 'SR-1002', quantity: 1, weight_kg: 12, dimensions: '600x1200x50' }
  ];

  constructor(private route: ActivatedRoute, private logisticsStore: LogisticsWorkflowStoreService) {
    this.route.paramMap.subscribe((params) => {
      this.packingId = params.get('id') || '';
      const match = this.logisticsStore.getPackingHeader(this.packingId);
      if (match) {
        this.packing = match;
      }
    });
  }

  startPacking(): void {
    this.logisticsStore.startPacking(this.packingId);
    this.packing = this.logisticsStore.getPackingHeader(this.packingId) || this.packing;
  }

  completePacking(): void {
    this.logisticsStore.completePacking(this.packingId);
    this.packing = this.logisticsStore.getPackingHeader(this.packingId) || this.packing;
  }
}
