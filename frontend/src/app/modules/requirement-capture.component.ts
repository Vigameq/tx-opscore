import { AfterViewInit, Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

interface InfoItem {
  label: string;
  value: string;
}

interface RequirementSection {
  title: string;
  items: InfoItem[];
}

const DEFAULT_FORM_DATA = {
  projectName: '',
  location: '',
  timeline: '',
  constraints: '',
  requirementType: 'Racks Enclosure',
  rittalSubsidiary: '',
  salesRepresentative: '',
  customer: '',
  projectLocation: '',
  channelDistribution: '',
  projectStatus: '',
  tender: '',
  chanceOfSuccess: '',
  customerBudget: '',
  definedMargin: '',
  competitors: '',
  drawingRequired: '',
  commissioningBy: '',
  incoterm: '',
  fillOutDate: '',
  offerUntil: '',
  expectedPurchaseDate: '',
  realisationStarting: '',
  risksHints: '',
  containerVersion: '',
  customersItLoad: '',
  numberOfItRacks: '',
  containerDimensionsSummary: '',
  supportsTierLevel: '',
  containerLength: '',
  containerWidth: '',
  containerHeight: '',
  airTempMax: '',
  airTempMin: '',
  airHumidityMax: '',
  seaLevelHeight: '',
  lacquering: '',
  doorsFront: '',
  doorsRear: '',
  separationWalls: '',
  linkageLeft: '',
  linkageRight: '',
  ductsForCables: '',
  ductsDetails: '',
  overpressureRelease: '',
  airVentilation: '',
  containerInterior: '',
  itRacks: '',
  rackAccessories: '',
  rackBayingConnectors: '',
  raisedFloor: '',
  switchGear: '',
  socketStrips: '',
  aisleContainment: '',
  cooling: '',
  coolingSupplyOutside: '',
  cmcMonitoring: '',
  vesda: '',
  furtherEquipment: '',
  fireSuppression: '',
  commissioningNotes: '',
  nearestAirport: '',
  transferTime: '',
  technicianDocs: '',
  specialConditions: '',
  mandatoryAttachments: '',
  containerFootprint: '',
  containerTransportConstraints: '',
  rackCount: '',
  rackType: '',
  rackRange: '',
  rackU: '',
  rackDepth: '',
  rackLoad: '',
  rackDoor: '',
  itLoad: '',
  redundancy: '',
  feeds: '',
  pduType: '',
  pduMounting: '',
  pduPhase: '',
  inputVoltage: '',
  currentRating: '',
  inputPlugType: '',
  cordLength: '',
  outletTypes: '',
  mixedOutlets: '',
  lockingOutlets: '',
  meteringGranularity: '',
  protocols: '',
  networkPorts: '',
  envSensors: '',
  plugTypes: '',
  outletCount: '',
  busbar: '',
  rdhx: '',
  airflow: '',
  compliance: '',
  iec: '',
  fireSafety: '',
  services: '',
  attachments: '',
};

type RequirementForm = typeof DEFAULT_FORM_DATA;

interface RequirementEntry {
  id: string;
  projectName: string;
  requirementType: string;
  location: string;
  timeline: string;
  status: string;
  updatedAt: string;
  data: RequirementForm;
}

@Component({
  selector: 'app-requirement-capture',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterLink, FormsModule],
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

  capturedProjects: RequirementEntry[] = [
    {
      id: 'req-001',
      projectName: 'Apollo Retail Expansion',
      requirementType: 'Racks Enclosure',
      location: 'Bengaluru, IN',
      timeline: '2025-02-12',
      status: 'Captured',
      updatedAt: '2025-01-14',
      data: {
        ...DEFAULT_FORM_DATA,
        projectName: 'Apollo Retail Expansion',
        requirementType: 'Racks Enclosure',
        location: 'Bengaluru, IN',
        timeline: '2025-02-12',
        constraints: 'Ceiling height 3.6m, 6-ton floor loading',
        rackCount: '42',
        rackU: '42U + 48U mix',
        rackDepth: '1200',
        rackLoad: '1200kg static',
        rackDoor: 'Mesh front · Solid rear',
        itLoad: '8-12 kW',
        redundancy: 'N+1',
        feeds: 'A/B dual feeds',
        pduType: 'Managed/Intelligent (outlet metering + switching + alerts)',
        plugTypes: 'IEC C13/C19, IEC 60309 32A',
        outletCount: '30 per rack',
        busbar: 'Required for row 3-5',
        cooling: 'Hot aisle containment',
        rdhx: 'Stage 1 capable',
        airflow: 'Front-to-back',
        compliance: 'ORv3 aligned',
        iec: 'IEC 60364, IS 732',
        fireSafety: 'VESDA + gas suppression',
        services: '24x7 on-call, 4hr response',
        attachments: 'Photos, floor plans, SLDs',
      },
    },
    {
      id: 'req-002',
      projectName: 'Nimbus Warehouse Upgrade',
      requirementType: "PDU's",
      location: 'Pune, IN',
      timeline: '2025-02-28',
      status: 'In review',
      updatedAt: '2025-01-10',
      data: {
        ...DEFAULT_FORM_DATA,
        projectName: 'Nimbus Warehouse Upgrade',
        requirementType: "PDU's",
        location: 'Pune, IN',
        timeline: '2025-02-28',
        rackType: '42U',
        rackRange: 'Row B, racks 12-18',
        itLoad: '9 kW',
        redundancy: '2N',
        feeds: 'A/B required',
        pduType: 'Monitored (networked, PDU-level metering)',
        pduMounting: '0U vertical',
        pduPhase: '3-phase',
        inputVoltage: '415V',
        currentRating: '32A',
        inputPlugType: 'IEC 60309',
        cordLength: '3m',
        outletTypes: 'C13/C19',
        outletCount: '36',
        mixedOutlets: 'Yes',
        lockingOutlets: 'No',
        meteringGranularity: 'Outlet group',
        protocols: 'SNMP',
        networkPorts: 'Dual',
        envSensors: 'Temp + door',
        compliance: 'IEC 60364',
        services: 'Commissioning + AMC',
        attachments: 'Rack layout, load schedule',
      },
    },
  ];

  showModal = false;
  formData: RequirementForm = { ...DEFAULT_FORM_DATA };
  showViewModal = false;
  selectedRequirement: RequirementEntry | null = null;
  selectedRequirementSections: RequirementSection[] = [];

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

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedRequirement = null;
    this.selectedRequirementSections = [];
  }

  submitRequirement(): void {
    if (!this.formData.projectName.trim()) {
      return;
    }

    const entry: RequirementEntry = {
      id: `req-${Date.now()}`,
      projectName: this.formData.projectName.trim(),
      requirementType: this.formData.requirementType,
      location: this.formData.location.trim() || 'TBD',
      timeline: this.formData.timeline || 'TBD',
      status: 'Captured',
      updatedAt: new Date().toISOString().slice(0, 10),
      data: { ...this.formData },
    };

    this.capturedProjects = [entry, ...this.capturedProjects];
    this.formData = { ...DEFAULT_FORM_DATA };
    this.showModal = false;
  }

  openRequirement(entry: RequirementEntry): void {
    const hydrated = this.hydrateRequirement(entry);
    this.selectedRequirement = hydrated;
    this.selectedRequirementSections = this.buildSections(hydrated);
    this.showViewModal = true;
  }

  // Ensure sections build with current helpers even for seeded data
  private hydrateRequirement(entry: RequirementEntry): RequirementEntry {
    return {
      ...entry,
      data: {
        ...DEFAULT_FORM_DATA,
        ...entry.data,
        projectName: entry.projectName,
        requirementType: entry.requirementType,
        location: entry.location,
        timeline: entry.timeline,
      },
    };
  }

  getStatusClass(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('review')) {
      return 'status-review';
    }
    if (normalized.includes('captured')) {
      return 'status-captured';
    }
    if (normalized.includes('draft')) {
      return 'status-draft';
    }
    return 'status-default';
  }

  exportRequirements(entry: RequirementEntry): void {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = margin;

    const addLine = (text: string, fontSize = 10, gap = 14) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += gap;
      });
    };

    doc.setFontSize(16);
    doc.text('Requirement Capture Export', margin, y);
    y += 22;
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toISOString().slice(0, 10)}`, margin, y);
    y += 20;

    const entries = [entry];
    entries.forEach((record, index) => {
      if (y > pageHeight - margin * 2) {
        doc.addPage();
        y = margin;
      }
      addLine(`${index + 1}. ${record.projectName}`, 12, 16);
      addLine(`Type: ${record.requirementType} · Status: ${record.status}`, 10, 14);
      addLine(`Location: ${record.location} · Timeline: ${record.timeline}`, 10, 14);
      y += 6;

      const sections = this.buildSections(record);
      sections.forEach((section) => {
        addLine(section.title, 11, 14);
        section.items.forEach((item) => {
          addLine(`${item.label}: ${item.value}`, 9, 12);
        });
        y += 6;
      });

      y += 10;
    });

    const safeName = entry.projectName.replace(/[^a-zA-Z0-9-_]+/g, '-').toLowerCase();
    doc.save(`requirement-${safeName || 'project'}.pdf`);
  }

  private buildSections(entry: RequirementEntry): RequirementSection[] {
    const sections: RequirementSection[] = [];
    const addItem = (items: InfoItem[], label: string, value: string) => {
      const val = value?.toString().trim() || 'unknown';
      items.push({ label, value: val });
    };

    const type = entry.requirementType;
    const data = entry.data;

    if (type === 'GCC') {
      const general: InfoItem[] = [];
      addItem(general, 'Rittal subsidiary', data.rittalSubsidiary);
      addItem(general, 'Sales representative', data.salesRepresentative);
      addItem(general, 'Customer', data.customer);
      addItem(general, 'Project location', data.projectLocation);
      addItem(general, 'Channel of distribution', data.channelDistribution);
      sections.push({ title: 'General project information', items: general });

      const offer: InfoItem[] = [];
      addItem(offer, 'Status of the project', data.projectStatus);
      addItem(offer, 'Tender', data.tender);
      addItem(offer, 'Chance of success', data.chanceOfSuccess);
      addItem(offer, "Customer's budget", data.customerBudget);
      addItem(offer, 'Defined margin', data.definedMargin);
      addItem(offer, 'Main competitors', data.competitors);
      addItem(offer, 'Drawing required', data.drawingRequired);
      addItem(offer, 'Commissioning by', data.commissioningBy);
      addItem(offer, 'Incoterm', data.incoterm);
      sections.push({ title: 'Offer parameters', items: offer });

      const timeline: InfoItem[] = [];
      addItem(timeline, 'Fill-out date', data.fillOutDate);
      addItem(timeline, 'Offer to subsidiary until', data.offerUntil);
      addItem(timeline, 'Expected purchase date', data.expectedPurchaseDate);
      addItem(timeline, 'Realisation starting', data.realisationStarting);
      sections.push({ title: 'Timeline', items: timeline });

      sections.push({
        title: 'Chances, risks, hints',
        items: [{ label: 'Notes', value: data.risksHints || 'unknown' }],
      });

      const container: InfoItem[] = [];
      addItem(container, 'Container version', data.containerVersion);
      addItem(container, 'Customer IT load (kW)', data.customersItLoad);
      addItem(container, 'Number of IT-Racks', data.numberOfItRacks);
      addItem(container, 'Container dimensions summary', data.containerDimensionsSummary);
      addItem(container, 'Supports tier level', data.supportsTierLevel);
      sections.push({ title: 'Container version', items: container });

      const dims: InfoItem[] = [];
      addItem(dims, 'Length (mm)', data.containerLength);
      addItem(dims, 'Width (mm)', data.containerWidth);
      addItem(dims, 'Height (mm)', data.containerHeight);
      sections.push({ title: 'Container dimensions', items: dims });

      const climate: InfoItem[] = [];
      addItem(climate, 'Air temperature max', data.airTempMax);
      addItem(climate, 'Air temperature min', data.airTempMin);
      addItem(climate, 'Air humidity max wet bulb', data.airHumidityMax);
      addItem(climate, 'Height above sea level', data.seaLevelHeight);
      sections.push({ title: 'Environmental climate conditions', items: climate });

      const config: InfoItem[] = [];
      addItem(config, 'Lacquering', data.lacquering);
      addItem(config, 'Doors front', data.doorsFront);
      addItem(config, 'Doors rear', data.doorsRear);
      addItem(config, 'Separation walls', data.separationWalls);
      sections.push({ title: 'Configuration of the container', items: config });

      const linkage: InfoItem[] = [];
      addItem(linkage, 'Linkage left', data.linkageLeft);
      addItem(linkage, 'Linkage right', data.linkageRight);
      sections.push({ title: 'Preparation for linkage', items: linkage });

      const ducts: InfoItem[] = [];
      addItem(ducts, 'Ducts', data.ductsForCables);
      addItem(ducts, 'Ducts details', data.ductsDetails);
      sections.push({ title: 'Ducts for cables and tubes', items: ducts });

      sections.push({ title: 'Overpressure release', items: [{ label: 'Release', value: data.overpressureRelease || 'unknown' }] });
      sections.push({ title: 'Air ventilation system', items: [{ label: 'Ventilation', value: data.airVentilation || 'unknown' }] });
      sections.push({ title: 'Container interior design', items: [{ label: 'Interior design', value: data.containerInterior || 'unknown' }] });
      sections.push({ title: 'IT server / network racks', items: [{ label: 'IT racks', value: data.itRacks || 'unknown' }] });
      sections.push({ title: 'Rack accessories', items: [{ label: 'Accessories', value: data.rackAccessories || 'unknown' }] });
      sections.push({ title: 'Rack baying connectors', items: [{ label: 'Baying connectors', value: data.rackBayingConnectors || 'unknown' }] });
      sections.push({ title: 'Raised floor', items: [{ label: 'Raised floor', value: data.raisedFloor || 'unknown' }] });
      sections.push({ title: 'Switch gear', items: [{ label: 'Switch gear', value: data.switchGear || 'unknown' }] });
      sections.push({ title: 'Socket strips in IT racks', items: [{ label: 'Socket strips', value: data.socketStrips || 'unknown' }] });
      sections.push({ title: 'Aisle containment', items: [{ label: 'Containment', value: data.aisleContainment || 'unknown' }] });
      sections.push({ title: 'Cooling', items: [{ label: 'Cooling', value: data.cooling || 'unknown' }] });
      sections.push({ title: 'Cooling supply outside', items: [{ label: 'Cooling supply', value: data.coolingSupplyOutside || 'unknown' }] });
      sections.push({ title: 'CMC monitoring', items: [{ label: 'Monitoring', value: data.cmcMonitoring || 'unknown' }] });
      sections.push({ title: 'VESDA', items: [{ label: 'VESDA', value: data.vesda || 'unknown' }] });
      sections.push({ title: 'Further equipment', items: [{ label: 'Equipment', value: data.furtherEquipment || 'unknown' }] });
      sections.push({ title: 'Fire detection & suppression', items: [{ label: 'Fire suppression', value: data.fireSuppression || 'unknown' }] });

      const commissioning: InfoItem[] = [];
      addItem(commissioning, 'Commissioning notes', data.commissioningNotes);
      addItem(commissioning, 'Nearest airport', data.nearestAirport);
      addItem(commissioning, 'Transfer time', data.transferTime);
      addItem(commissioning, 'Technician documents', data.technicianDocs);
      addItem(commissioning, 'Special conditions', data.specialConditions);
      sections.push({ title: 'Commissioning', items: commissioning });

      sections.push({
        title: 'Mandatory attachments',
        items: [{ label: 'Attachments', value: data.mandatoryAttachments || 'unknown' }],
      });

      return sections;
    }

    const site: InfoItem[] = [];
    addItem(site, 'Location', data.location);
    addItem(site, 'Timeline', data.timeline);
    addItem(site, 'Constraints', data.constraints);
    sections.push({ title: 'Site info', items: site });

    if (this.showRackSectionFor(type)) {
      const rack: InfoItem[] = [];
      addItem(rack, 'Count', data.rackCount);
      addItem(rack, 'U height', data.rackU);
      addItem(rack, 'Depth (mm)', data.rackDepth);
      addItem(rack, 'Load rating', data.rackLoad);
      addItem(rack, 'Door type', data.rackDoor);
      sections.push({ title: 'Rack requirements', items: rack });
    }

    if (this.showItLoadSectionFor(type)) {
      const it: InfoItem[] = [];
      addItem(it, 'kW per rack', data.itLoad);
      addItem(it, 'Redundancy', data.redundancy);
      addItem(it, 'A/B feeds', data.feeds);
      sections.push({ title: 'IT load', items: it });
    }

    if (type === "PDU's") {
      const context: InfoItem[] = [];
      addItem(context, 'Rack type', data.rackType);
      addItem(context, 'Affected racks / range', data.rackRange);
      addItem(context, 'Rack power density', data.itLoad);
      addItem(context, 'Redundancy', data.redundancy);
      addItem(context, 'A/B feeds', data.feeds);
      sections.push({ title: 'Rack & power context', items: context });

      const power: InfoItem[] = [];
      addItem(power, 'PDU type', data.pduType);
      addItem(power, 'Mounting', data.pduMounting);
      addItem(power, 'Phase', data.pduPhase);
      addItem(power, 'Input voltage', data.inputVoltage);
      addItem(power, 'Current rating (A)', data.currentRating);
      addItem(power, 'Input plug type', data.inputPlugType);
      addItem(power, 'Cord length', data.cordLength);
      addItem(power, 'Outlet types', data.outletTypes);
      addItem(power, 'Outlet count', data.outletCount);
      addItem(power, 'Mixed outlets', data.mixedOutlets);
      addItem(power, 'Locking outlets', data.lockingOutlets);
      addItem(power, 'Metering granularity', data.meteringGranularity);
      addItem(power, 'Protocols', data.protocols);
      addItem(power, 'Network ports', data.networkPorts);
      addItem(power, 'Environmental sensors', data.envSensors);
      sections.push({ title: 'Power (PDU)', items: power });
    } else if (this.showPowerSectionFor(type)) {
      const power: InfoItem[] = [];
      addItem(power, 'PDU type', data.pduType);
      addItem(power, 'Plug types', data.plugTypes);
      addItem(power, 'Outlet count', data.outletCount);
      addItem(power, 'Busbar requirements', data.busbar);
      sections.push({ title: 'Power', items: power });
    }

    if (this.showCoolingSectionFor(type)) {
      const cooling: InfoItem[] = [];
      addItem(cooling, 'Hot/Cold aisle', data.cooling);
      addItem(cooling, 'RDHx readiness', data.rdhx);
      addItem(cooling, 'Airflow direction', data.airflow);
      sections.push({ title: 'Cooling / containment', items: cooling });
    }

    if (type === 'Micro Data Center') {
      sections.push({
        title: 'Container / skid footprint',
        items: [{ label: 'Footprint', value: data.containerFootprint || 'unknown' }],
      });
    }

    if (type === 'Container DC') {
      sections.push({
        title: 'Container dimensions / transport constraints',
        items: [{ label: 'Transport constraints', value: data.containerTransportConstraints || 'unknown' }],
      });
    }

    const compliance: InfoItem[] = [];
    addItem(compliance, 'OCP ORv3', data.compliance);
    addItem(compliance, 'IEC/IS standards', data.iec);
    addItem(compliance, 'Fire safety', data.fireSafety);
    addItem(compliance, 'Services', data.services);
    sections.push({ title: 'Compliance & services', items: compliance });

    sections.push({
      title: 'Attachments',
      items: [{ label: 'Attachments', value: data.attachments || 'unknown' }],
    });

    return sections;
  }

  private showRackSectionFor(type: string): boolean {
    return ['Racks Enclosure', 'Micro Data Center', 'Container DC'].includes(type);
  }

  private showItLoadSectionFor(type: string): boolean {
    return ['Racks Enclosure', 'Micro Data Center', 'Container DC', 'TierAI Tool'].includes(type);
  }

  private showPowerSectionFor(type: string): boolean {
    return ['Racks Enclosure', 'Micro Data Center', "PDU's", 'Container DC'].includes(type);
  }

  private showCoolingSectionFor(type: string): boolean {
    return ['Racks Enclosure', 'Micro Data Center', 'Container DC'].includes(type);
  }

  get showRackSection(): boolean {
    return [
      'Racks Enclosure',
      'Micro Data Center',
      'Container DC',
    ].includes(this.formData.requirementType);
  }

  get showItLoadSection(): boolean {
    return [
      'Racks Enclosure',
      'Micro Data Center',
      'Container DC',
      'TierAI Tool',
    ].includes(this.formData.requirementType);
  }

  get showPowerSection(): boolean {
    return [
      'Racks Enclosure',
      'Micro Data Center',
      "PDU's",
      'Container DC',
    ].includes(this.formData.requirementType);
  }

  get showCoolingSection(): boolean {
    return [
      'Racks Enclosure',
      'Micro Data Center',
      'Container DC',
    ].includes(this.formData.requirementType);
  }

  get showContainerFootprint(): boolean {
    return this.formData.requirementType === 'Micro Data Center';
  }

  get showContainerTransport(): boolean {
    return this.formData.requirementType === 'Container DC';
  }

  get showPduExtras(): boolean {
    return this.formData.requirementType === "PDU's";
  }

  get showPduContext(): boolean {
    return this.formData.requirementType === "PDU's";
  }
}
