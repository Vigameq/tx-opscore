import { Injectable } from '@angular/core';

export type ShipmentState =
  | 'READY_FOR_PACKING'
  | 'PACKING_IN_PROGRESS'
  | 'PACKED'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCH_PLANNED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'DELIVERY_CONFIRMED';

export interface PackingHeader {
  packing_id: string;
  work_order_id: string;
  sales_order_id: string;
  status: ShipmentState;
  packed_by: string;
  packed_at: string;
}

export interface ShipmentHeader {
  shipment_id: string;
  sales_order_id: string;
  packing_id: string;
  transporter: string;
  vehicle_number: string;
  lr_number: string;
  from_location: string;
  to_location: string;
  status: ShipmentState;
  dispatch_date: string;
  expected_delivery: string;
}

export interface DeliveryDocument {
  doc_type: 'DC' | 'EWAY' | 'INVOICE' | 'POD';
  doc_number: string;
  file_path: string;
}

@Injectable({ providedIn: 'root' })
export class LogisticsWorkflowStoreService {
  private packingHeaders: PackingHeader[] = [
    {
      packing_id: 'PK-2026-011',
      work_order_id: 'WO-2026-041',
      sales_order_id: 'SO-2026-021',
      status: 'READY_FOR_PACKING',
      packed_by: '',
      packed_at: ''
    },
    {
      packing_id: 'PK-2026-012',
      work_order_id: 'WO-2026-045',
      sales_order_id: 'SO-2026-018',
      status: 'PACKED',
      packed_by: 'stores_01',
      packed_at: '2026-01-26'
    }
  ];

  private shipments: ShipmentHeader[] = [
    {
      shipment_id: 'SHP-2026-021',
      sales_order_id: 'SO-2026-018',
      packing_id: 'PK-2026-012',
      transporter: 'BlueDart',
      vehicle_number: 'KA-01-AB-1234',
      lr_number: 'LR-88991',
      from_location: 'Bengaluru',
      to_location: 'Hyderabad',
      status: 'DISPATCH_PLANNED',
      dispatch_date: '2026-01-28',
      expected_delivery: '2026-01-30'
    }
  ];

  private documents: Record<string, DeliveryDocument[]> = {
    'SHP-2026-021': [
      { doc_type: 'DC', doc_number: 'DC-112', file_path: 'delivery_challan.pdf' },
      { doc_type: 'EWAY', doc_number: 'EW-7788', file_path: 'eway_bill.pdf' }
    ]
  };

  getPackingHeaders(): PackingHeader[] {
    return this.packingHeaders;
  }

  getPackingHeader(packingId: string): PackingHeader | undefined {
    return this.packingHeaders.find((item) => item.packing_id === packingId);
  }

  getShipment(shipmentId: string): ShipmentHeader | undefined {
    return this.shipments.find((item) => item.shipment_id === shipmentId);
  }

  getShipmentByPacking(packingId: string): ShipmentHeader | undefined {
    return this.shipments.find((item) => item.packing_id === packingId);
  }

  getDocuments(shipmentId: string): DeliveryDocument[] {
    return this.documents[shipmentId] || [];
  }

  startPacking(packingId: string): void {
    this.packingHeaders = this.packingHeaders.map((item) =>
      item.packing_id === packingId
        ? { ...item, status: 'PACKING_IN_PROGRESS' }
        : item
    );
  }

  completePacking(packingId: string): void {
    this.packingHeaders = this.packingHeaders.map((item) =>
      item.packing_id === packingId
        ? {
            ...item,
            status: 'PACKED',
            packed_by: 'stores_01',
            packed_at: new Date().toISOString().slice(0, 10)
          }
        : item
    );
  }

  planDispatch(shipmentId: string): void {
    this.shipments = this.shipments.map((item) =>
      item.shipment_id === shipmentId ? { ...item, status: 'DISPATCH_PLANNED' } : item
    );
  }

  dispatchGoods(shipmentId: string): void {
    this.shipments = this.shipments.map((item) =>
      item.shipment_id === shipmentId ? { ...item, status: 'DISPATCHED' } : item
    );
  }

  markInTransit(shipmentId: string): void {
    this.shipments = this.shipments.map((item) =>
      item.shipment_id === shipmentId ? { ...item, status: 'IN_TRANSIT' } : item
    );
  }

  markDelivered(shipmentId: string): void {
    this.shipments = this.shipments.map((item) =>
      item.shipment_id === shipmentId ? { ...item, status: 'DELIVERED' } : item
    );
  }

  confirmDelivery(shipmentId: string): void {
    this.shipments = this.shipments.map((item) =>
      item.shipment_id === shipmentId ? { ...item, status: 'DELIVERY_CONFIRMED' } : item
    );
  }
}
