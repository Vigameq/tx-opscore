import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalesOrderStoreService } from '../services/sales-order-store.service';

@Component({
  selector: 'app-po-intake',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './po-intake.component.html',
  styleUrl: './po-intake.component.scss'
})
export class PoIntakeComponent {
  quotationId = '';
  currentRole = 'SALES';
  currentState = 'PO_RECEIVED';

  quotationSnapshot = {
    quotation_id: 'QT-88991',
    customer_name: 'ABC Data Centers Pvt Ltd',
    project_name: 'BLR-DC-Phase1',
    total_price: '₹12,500,000',
    delivery_weeks: '10'
  };

  poHeader = {
    po_number: '',
    po_date: '',
    po_value: '',
    currency: 'INR',
    payment_terms: 'Net 30',
    delivery_date: ''
  };

  validationFlags = {
    priceMismatch: false,
    scopeChange: false,
    varianceNotes: ''
  };

  addresses = {
    billing_address: '',
    shipping_address: ''
  };

  poDocumentName = '';

  private salesOrderStore: SalesOrderStoreService;

  constructor(route: ActivatedRoute, salesOrderStore: SalesOrderStoreService) {
    this.salesOrderStore = salesOrderStore;
    route.paramMap.subscribe((params) => {
      this.quotationId = params.get('quotationId') || this.quotationSnapshot.quotation_id;
      this.quotationSnapshot = {
        ...this.quotationSnapshot,
        quotation_id: this.quotationId
      };
    });
  }

  onPoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.poDocumentName = file ? file.name : '';
  }

  canSubmit(): boolean {
    return this.currentRole === 'SALES' && this.currentState === 'PO_RECEIVED';
  }

  submitForVerification(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.runValidationChecks();
    const hasVariance = this.validationFlags.priceMismatch || this.validationFlags.scopeChange;
    const message = hasVariance
      ? 'PO has variances. Submit for verification anyway?'
      : 'Submit this PO for verification?';
    const confirmed = window.confirm(message);
    if (!confirmed) {
      return;
    }
    this.currentState = 'PO_VERIFIED';
    this.salesOrderStore.updateStatusByQuotationId(this.quotationId, 'PO_VERIFIED');
    window.alert('PO submitted and verified (mock).');
  }

  runValidationChecks(): void {
    const poValue = Number(String(this.poHeader.po_value).replace(/[^0-9.]/g, ''));
    const quotedValue = Number(String(this.quotationSnapshot.total_price).replace(/[^0-9.]/g, ''));
    this.validationFlags.priceMismatch = poValue > 0 && quotedValue > 0 && poValue !== quotedValue;
    this.validationFlags.scopeChange = false;
    this.validationFlags.varianceNotes = this.validationFlags.priceMismatch
      ? 'PO value does not match quoted value.'
      : 'No variance detected.';
  }
}
