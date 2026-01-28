import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { LogisticsWorkflowStoreService } from '../services/logistics-workflow-store.service';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './shipment-detail.component.html',
  styleUrl: './shipment-detail.component.scss'
})
export class ShipmentDetailComponent {
  shipmentId = '';
  shipment = this.logisticsStore.getShipment('SHP-2026-021');
  documents = this.shipment ? this.logisticsStore.getDocuments(this.shipment.shipment_id) : [];
  activeTab: 'Transport Details' | 'Documents' = 'Transport Details';

  constructor(private route: ActivatedRoute, private logisticsStore: LogisticsWorkflowStoreService) {
    this.route.paramMap.subscribe((params) => {
      this.shipmentId = params.get('shipmentId') || '';
      const match = this.logisticsStore.getShipment(this.shipmentId);
      if (match) {
        this.shipment = match;
        this.documents = this.logisticsStore.getDocuments(match.shipment_id);
      }
    });
  }

  setTab(tab: 'Transport Details' | 'Documents'): void {
    this.activeTab = tab;
  }

  dispatchGoods(): void {
    if (!this.shipment) {
      return;
    }
    this.logisticsStore.dispatchGoods(this.shipment.shipment_id);
    this.shipment = this.logisticsStore.getShipment(this.shipment.shipment_id);
  }

  markInTransit(): void {
    if (!this.shipment) {
      return;
    }
    this.logisticsStore.markInTransit(this.shipment.shipment_id);
    this.shipment = this.logisticsStore.getShipment(this.shipment.shipment_id);
  }

  markDelivered(): void {
    if (!this.shipment) {
      return;
    }
    this.logisticsStore.markDelivered(this.shipment.shipment_id);
    this.shipment = this.logisticsStore.getShipment(this.shipment.shipment_id);
  }

  confirmDelivery(): void {
    if (!this.shipment) {
      return;
    }
    this.logisticsStore.confirmDelivery(this.shipment.shipment_id);
    this.shipment = this.logisticsStore.getShipment(this.shipment.shipment_id);
  }
}
