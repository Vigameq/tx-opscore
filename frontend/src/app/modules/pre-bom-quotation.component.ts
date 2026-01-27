import { AfterViewInit, Component } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { PreBomRecord, PreBomStoreService } from '../services/pre-bom-store.service';

interface PreBomHeader {
  pre_bom_id: string;
  revision: string;
  status: string;
  currency: string;
  target_selling_price: number;
  expected_margin_pct: number;
  quotation_validity: number;
  expected_delivery_weeks: number;
  delivery_location: string;
  incoterms: string;
  sales_notes: string;
  special_conditions: string;
}

@Component({
  selector: 'app-pre-bom-quotation',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DecimalPipe, FormsModule],
  templateUrl: './pre-bom-quotation.component.html',
  styleUrl: './pre-bom-quotation.component.scss'
})
export class PreBomQuotationComponent implements AfterViewInit {
  private preBomStore: PreBomStoreService;

  constructor(preBomStore: PreBomStoreService) {
    this.preBomStore = preBomStore;
  }
  summary = [
    { label: 'Draft BOMs', value: '6' },
    { label: 'Quotes sent', value: '3' },
    { label: 'Avg margin', value: '18%' },
  ];

  get preBomRecords(): PreBomRecord[] {
    return this.preBomStore.getPreBomRecords();
  }

  quotationRecords = [
    {
      id: 'QT-88991',
      customer: 'ABC Data Centers Pvt Ltd',
      status: 'SENT',
      amount: '₹12,500,000',
      amountValue: 12500000,
      updatedAt: '2026-01-26'
    },
    {
      id: 'QT-88977',
      customer: 'Nimbus Logistics',
      status: 'DRAFT',
      amount: '₹4,200,000',
      amountValue: 4200000,
      updatedAt: '2026-01-22'
    },
    {
      id: 'QT-88912',
      customer: 'Helios Energy',
      status: 'APPROVED',
      amount: '₹9,750,000',
      amountValue: 9750000,
      updatedAt: '2026-01-18'
    },
  ];

  exportQuotation(recordId: string): void {
    const record = this.quotationRecords.find((item) => item.id === recordId);
    if (!record) {
      window.alert('Quotation not found.');
      return;
    }

    const doc = new jsPDF();
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10);

    doc.setFontSize(16);
    doc.text('Quotation Summary', 14, 18);

    doc.setFontSize(11);
    doc.text(`Quotation ID: ${record.id}`, 14, 30);
    doc.text(`Customer: ${record.customer}`, 14, 38);
    doc.text(`Status: ${record.status}`, 14, 46);
    doc.text(`Amount: ${record.amount}`, 14, 54);
    doc.text(`Last Updated: ${record.updatedAt}`, 14, 62);
    doc.text(`Exported: ${dateString}`, 14, 70);

    doc.save(`${record.id}-quotation.pdf`);
  }

  preBomHeader: PreBomHeader = {
    pre_bom_id: 'PBOM-2026-0001',
    revision: 'V1',
    status: 'DRAFT',
    currency: 'INR',
    target_selling_price: 12500000,
    expected_margin_pct: 18,
    quotation_validity: 60,
    expected_delivery_weeks: 10,
    delivery_location: 'Bengaluru, IN',
    incoterms: 'FOB',
    sales_notes: 'Priority account. Align delivery with site readiness.',
    special_conditions: 'Split shipment allowed.'
  };

  get totalCost(): number {
    return this.preBomHeader.target_selling_price || 0;
  }

  get approvedQuotationTotal(): number {
    return this.quotationRecords
      .filter((quote) => quote.status === 'APPROVED')
      .reduce((sum, quote) => sum + quote.amountValue, 0);
  }

  showQuoteModal = false;
  customerMode: 'existing' | 'new' = 'existing';
  quoteForm = {
    customer: '',
    email: '',
    customerName: '',
    contactEmail: '',
    gstin: '',
    opportunityId: '',
    validUntil: '2026-02-08',
  };
  quoteLineItems = [
    { item: '', uom: 'Nos', qty: 1, price: 0 }
  ];

  onOpportunityChange(): void {
    const selected = this.preBomRecords.find((record) => record.opportunityId === this.quoteForm.opportunityId);
    if (!selected) {
      return;
    }
    const customerName = selected.snapshot?.customer_name || selected.project;
    this.quoteForm.customer = customerName;
    this.quoteForm.customerName = customerName;
    this.quoteLineItems = [
      { item: 'Pre-BOM package', uom: 'Nos', qty: 1, price: 0 },
    ];
  }

  openQuoteModal(): void {
    this.showQuoteModal = true;
  }

  closeQuoteModal(): void {
    this.showQuoteModal = false;
  }


  addLineItem(): void {
    this.quoteLineItems = [...this.quoteLineItems, { item: '', uom: 'Nos', qty: 1, price: 0 }];
  }

  removeLineItem(index: number): void {
    if (this.quoteLineItems.length <= 1) {
      return;
    }
    const confirmed = window.confirm('Delete this line item?');
    if (!confirmed) {
      return;
    }
    this.quoteLineItems = this.quoteLineItems.filter((_, idx) => idx !== index);
  }

  get quoteTotal(): number {
    return this.quoteLineItems.reduce((sum, line) => sum + line.qty * line.price, 0);
  }

  ngAfterViewInit(): void {
    const animated = Array.from(document.querySelectorAll('[data-animate]')) as HTMLElement[];

    animated.forEach((element, index) => {
      const delay = Math.min(index * 0.08, 0.5);
      element.style.animationDelay = `${delay}s`;
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      animated.forEach((element) => observer.observe(element));
    } else {
      animated.forEach((element) => element.classList.add('is-visible'));
    }
  }
}
