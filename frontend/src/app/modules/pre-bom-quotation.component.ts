import { AfterViewInit, Component } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface BomLine {
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
  notes: string;
}

interface BomSection {
  title: string;
  subtitle: string;
  items: BomLine[];
}

@Component({
  selector: 'app-pre-bom-quotation',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DecimalPipe, FormsModule],
  templateUrl: './pre-bom-quotation.component.html',
  styleUrl: './pre-bom-quotation.component.scss'
})
export class PreBomQuotationComponent implements AfterViewInit {
  summary = [
    { label: 'Draft BOMs', value: '6' },
    { label: 'Quotes sent', value: '3' },
    { label: 'Avg margin', value: '18%' },
  ];

  bomSections: BomSection[] = [
    {
      title: 'IT Racks & Accessories',
      subtitle: 'Primary enclosures and add-ons for compute bays.',
      items: [
        { item: '42U rack enclosure', qty: 42, unit: 'ea', unitCost: 1200, notes: 'Mesh front, solid rear' },
        { item: 'Cable management kit', qty: 42, unit: 'set', unitCost: 120, notes: 'Vertical + horizontal' },
        { item: 'Blanking panels', qty: 210, unit: 'ea', unitCost: 8, notes: 'Mixed 1U/2U' },
      ]
    },
    {
      title: 'Power',
      subtitle: 'Distribution, protection, and feed hardware.',
      items: [
        { item: 'Managed PDU (0U)', qty: 84, unit: 'ea', unitCost: 420, notes: 'C13/C19 mix' },
        { item: 'Busbar tap-off box', qty: 16, unit: 'ea', unitCost: 640, notes: '32A, metered' },
        { item: 'Main input breaker', qty: 2, unit: 'ea', unitCost: 1800, notes: '400A, 4P' },
      ]
    },
    {
      title: 'Cooling',
      subtitle: 'In-row or in-rack cooling systems.',
      items: [
        { item: 'LCP CW 40kW', qty: 7, unit: 'ea', unitCost: 14800, notes: 'Water-glycol' },
        { item: 'Coolant distribution unit', qty: 2, unit: 'ea', unitCost: 7600, notes: 'Dual pump' },
      ]
    },
    {
      title: 'Containment',
      subtitle: 'Aisle containment and air management.',
      items: [
        { item: 'Hot aisle doors', qty: 2, unit: 'set', unitCost: 2200, notes: 'Sliding, auto-close' },
        { item: 'Roof panels', qty: 14, unit: 'ea', unitCost: 180, notes: 'Clear polycarbonate' },
      ]
    },
    {
      title: 'Monitoring & Controls',
      subtitle: 'Telemetry, sensors, and alerts.',
      items: [
        { item: 'CMC monitoring gateway', qty: 2, unit: 'ea', unitCost: 1500, notes: 'SNMP + Modbus' },
        { item: 'Temp/humidity sensors', qty: 24, unit: 'ea', unitCost: 95, notes: 'Rack-level' },
      ]
    },
    {
      title: 'Fire & Safety',
      subtitle: 'Detection and suppression provisions.',
      items: [
        { item: 'VESDA detector', qty: 1, unit: 'ea', unitCost: 5200, notes: 'Aspirating system' },
        { item: 'Clean agent suppression', qty: 1, unit: 'lot', unitCost: 18500, notes: 'Novec 1230' },
      ]
    },
    {
      title: 'Services',
      subtitle: 'Installation, commissioning, and SLA.',
      items: [
        { item: 'Installation & commissioning', qty: 1, unit: 'lot', unitCost: 125000, notes: 'Includes testing' },
        { item: 'AMC/SLA (12 months)', qty: 1, unit: 'lot', unitCost: 32000, notes: '24x7 coverage' },
      ]
    },
    {
      title: 'Logistics & Packaging',
      subtitle: 'Crating, insurance, and delivery.',
      items: [
        { item: 'Export-grade wooden crates', qty: 12, unit: 'ea', unitCost: 220, notes: 'Shock indicators' },
        { item: 'Insurance coverage', qty: 1, unit: 'lot', unitCost: 8000, notes: 'Door-to-door' },
        { item: 'Last-mile delivery', qty: 1, unit: 'lot', unitCost: 12000, notes: 'Site handling' },
      ]
    },
  ];

  get totalCost(): number {
    return this.bomSections.reduce(
      (sectionSum, section) =>
        sectionSum + section.items.reduce((sum, line) => sum + line.qty * line.unitCost, 0),
      0
    );
  }

  showQuoteModal = false;
  customerMode: 'existing' | 'new' = 'existing';
  quoteForm = {
    customer: '',
    email: '',
    customerName: '',
    contactEmail: '',
    gstin: '',
    validUntil: '2026-02-08',
  };
  quoteLineItems = [
    { item: '', uom: 'Nos', qty: 1, price: 0 }
  ];

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
