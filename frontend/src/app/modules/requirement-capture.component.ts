import { AfterViewInit, Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface InfoItem {
  label: string;
  value: string;
}

interface RequirementSection {
  title: string;
  items: InfoItem[];
}

@Component({
  selector: 'app-requirement-capture',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule],
  templateUrl: './requirement-capture.component.html',
  styleUrl: './requirement-capture.component.scss'
})
export class RequirementCaptureComponent implements AfterViewInit {
  summaryPills = [
    { label: 'Active sites', value: '4' },
    { label: 'Racks scoped', value: '126' },
    { label: 'SLA tier', value: 'Gold' },
  ];

  sections: RequirementSection[] = [
    {
      title: 'Site info',
      items: [
        { label: 'Location', value: 'Bengaluru, IN · Whitefield' },
        { label: 'Timeline', value: 'Design: 6 wks · Build: 12 wks' },
        { label: 'Constraints', value: 'Ceiling height 3.6m, 6-ton floor loading' },
      ],
    },
    {
      title: 'Rack requirements',
      items: [
        { label: 'Count', value: '42 racks' },
        { label: 'U height', value: '42U + 48U mix' },
        { label: 'Depth', value: '1200mm' },
        { label: 'Load rating', value: '1200kg static' },
        { label: 'Door type', value: 'Mesh front · Solid rear' },
      ],
    },
    {
      title: 'IT load',
      items: [
        { label: 'kW per rack', value: '8-12 kW' },
        { label: 'Redundancy', value: 'N+1' },
        { label: 'Feeds', value: 'A/B dual feeds' },
      ],
    },
    {
      title: 'Power',
      items: [
        { label: 'PDU type', value: 'Managed with outlet metering' },
        { label: 'Plug types', value: 'IEC C13/C19, IEC 60309 32A' },
        { label: 'Outlet count', value: '30 per rack' },
        { label: 'Busbar', value: 'Required for row 3-5' },
      ],
    },
    {
      title: 'Cooling / containment',
      items: [
        { label: 'Aisle strategy', value: 'Hot aisle containment' },
        { label: 'RDHx readiness', value: 'Stage 1 capable' },
        { label: 'Airflow', value: 'Front-to-back' },
      ],
    },
    {
      title: 'Compliance',
      items: [
        { label: 'OCP', value: 'ORv3 aligned' },
        { label: 'IEC/IS standards', value: 'IEC 60364, IS 732' },
        { label: 'Fire safety', value: 'VESDA + gas suppression' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Installation', value: 'TierX managed' },
        { label: 'Commissioning', value: 'Pre-prod validation' },
        { label: 'AMC/SLA', value: '24x7 on-call, 4hr response' },
      ],
    },
  ];

  attachments = [
    { name: 'Site photos', detail: '12 images · 2.4GB' },
    { name: 'Floor plans', detail: '2 PDFs · Rev B' },
    { name: 'Single line diagrams', detail: '3 CAD exports' },
  ];

  capturedProjects = [
    {
      id: 'req-001',
      projectName: 'Apollo Retail Expansion',
      location: 'Bengaluru, IN',
      timeline: 'Design: 6 wks · Build: 12 wks',
      status: 'Captured',
      updatedAt: '2025-01-14',
    },
    {
      id: 'req-002',
      projectName: 'Nimbus Warehouse Upgrade',
      location: 'Pune, IN',
      timeline: 'Design: 4 wks · Build: 10 wks',
      status: 'In review',
      updatedAt: '2025-01-10',
    },
  ];

  showModal = false;
  formData = {
    projectName: '',
    location: '',
    timeline: '',
    constraints: '',
    rackCount: '',
    rackU: '',
    rackDepth: '',
    rackLoad: '',
    rackDoor: '',
    itLoad: '',
    redundancy: '',
    feeds: '',
    pduType: '',
    plugTypes: '',
    outletCount: '',
    busbar: '',
    cooling: '',
    rdhx: '',
    airflow: '',
    compliance: '',
    iec: '',
    fireSafety: '',
    services: '',
    attachments: '',
  };

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

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  submitRequirement(): void {
    if (!this.formData.projectName.trim()) {
      return;
    }

    const entry = {
      id: `req-${Date.now()}`,
      projectName: this.formData.projectName.trim(),
      location: this.formData.location.trim() || 'TBD',
      timeline: this.formData.timeline.trim() || 'TBD',
      status: 'Captured',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    this.capturedProjects = [entry, ...this.capturedProjects];
    this.formData = {
      projectName: '',
      location: '',
      timeline: '',
      constraints: '',
      rackCount: '',
      rackU: '',
      rackDepth: '',
      rackLoad: '',
      rackDoor: '',
      itLoad: '',
      redundancy: '',
      feeds: '',
      pduType: '',
      plugTypes: '',
      outletCount: '',
      busbar: '',
      cooling: '',
      rdhx: '',
      airflow: '',
      compliance: '',
      iec: '',
      fireSafety: '',
      services: '',
      attachments: '',
    };
    this.showModal = false;
  }
}
