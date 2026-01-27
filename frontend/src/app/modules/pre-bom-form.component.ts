import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreBomStoreService, RequirementSnapshot } from '../services/pre-bom-store.service';

type Role = 'SALES' | 'ENGINEERING' | 'SCM' | 'FINANCE' | 'MANAGEMENT';

type RequirementOption = RequirementSnapshot;

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

interface FinishedGoodsLine {
  line_no: number;
  product_family: string;
  product_model: string;
  description: string;
  quantity: number;
  uom: string;
  config_summary: string;
  target_unit_price?: number;
  target_lead_time_weeks?: number;
}

interface EngineeringConfig {
  rack_height_u: string;
  rack_width_mm: string;
  rack_depth_mm: string;
  load_rating_kg: string;
  door_type: string;
  airflow_direction: string;
  color_finish: string;
  compliance_tags: string;
  pdu_type: string;
  pdu_phase: string;
  pdu_input_plug: string;
  pdu_outlet: string;
  pdu_metering: string;
  busbar_rating_a: string;
  busbar_length: string;
  busbar_redundancy: string;
  busbar_tapoff: string;
}

interface EngineeringItem {
  line_id: number;
  parent_line_id: number | null;
  level: number;
  category: string;
  item_code: string;
  item_name: string;
  specification: string;
  qty_per_fg: number;
  uom: string;
  make_buy_flag: string;
  compliance: string;
  drawing_ref: string;
  critical_item: boolean;
}

interface ScmLine {
  item_line_id: number;
  source_type: string;
  preferred_vendor: string;
  alternate_vendor: string;
  moq: number;
  lead_time_days: number;
  import_flag: boolean;
  single_source_risk: boolean;
  availability_status: string;
  remarks: string;
}

interface CostLine {
  item_line_id: number;
  estimated_unit_cost: number;
  tooling_cost: number;
  bought_out_cost: number;
  labor_cost: number;
  overhead_cost: number;
  estimated_total_cost: number;
}

interface CostSummary {
  total_estimated_cost: number;
  final_price: number;
  gross_margin_pct: number;
}

interface ServicesDelivery {
  installation_required: string;
  commissioning_required: string;
  site_supervision_days: string;
  training_required: string;
  warranty_period: string;
  amc_option: string;
}

interface ApprovalLog {
  date: string;
  action: string;
  from: string;
  to: string;
  remarks: string;
}

@Component({
  selector: 'app-pre-bom-form',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DecimalPipe, FormsModule],
  templateUrl: './pre-bom-form.component.html',
  styleUrl: './pre-bom-form.component.scss'
})
export class PreBomFormComponent implements OnInit {
  private route: ActivatedRoute;
  private preBomStore: PreBomStoreService;

  constructor(route: ActivatedRoute, preBomStore: PreBomStoreService) {
    this.route = route;
    this.preBomStore = preBomStore;
  }
  currentRole: Role = 'SALES';
  selectedOpportunityId = '';
  requirementOptions: RequirementOption[] = [];

  requirementSnapshot: RequirementSnapshot = {
    customer_name: 'ABC Data Centers Pvt Ltd',
    opportunity_id: 'OPP-56789',
    project_name: 'BLR-DC-Phase1',
    site_location: 'Bengaluru, IN · Whitefield',
    segment: 'Enterprise',
    product_families_required: 'Rack, PDU, Busbar, Containment',
    rack_count: 42,
    it_load_per_rack: 10,
    redundancy: 'N+1',
    compliance: 'OCP ORV3, IEC 60364, IS 732',
    target_delivery_date: '2026-03-15',
    attachments: ['Floor plan.pdf', 'SLD.png', 'Customer spec.docx']
  };

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

  finishedGoods: FinishedGoodsLine[] = [
    {
      line_no: 1,
      product_family: 'Rack',
      product_model: 'ORV3',
      description: 'Rack enclosure system',
      quantity: 42,
      uom: 'Nos',
      config_summary: '42U, 1200mm depth, mesh front',
      target_unit_price: 280000,
      target_lead_time_weeks: 8
    },
    {
      line_no: 2,
      product_family: 'PDU',
      product_model: 'Managed',
      description: 'Smart PDU with outlet metering',
      quantity: 84,
      uom: 'Nos',
      config_summary: '3P, C13/C19 mix',
      target_unit_price: 42000,
      target_lead_time_weeks: 6
    }
  ];

  engineeringConfig: EngineeringConfig = {
    rack_height_u: '42U',
    rack_width_mm: '600',
    rack_depth_mm: '1200',
    load_rating_kg: '1200',
    door_type: 'Mesh',
    airflow_direction: 'Front-to-back',
    color_finish: 'Black',
    compliance_tags: 'OCP ORV3',
    pdu_type: 'Managed',
    pdu_phase: '3P',
    pdu_input_plug: 'IEC 60309',
    pdu_outlet: 'C13/C19 - 30 outlets',
    pdu_metering: 'Outlet + network',
    busbar_rating_a: '250A',
    busbar_length: '12m',
    busbar_redundancy: 'N+1',
    busbar_tapoff: '32A metered'
  };

  engineeringItems: EngineeringItem[] = [
    {
      line_id: 1,
      parent_line_id: null,
      level: 0,
      category: 'Structure',
      item_code: 'FRAME-ORV3',
      item_name: 'Rack Frame Assembly',
      specification: 'MS, powder coated, 2.0mm',
      qty_per_fg: 1,
      uom: 'Nos',
      make_buy_flag: 'MAKE',
      compliance: 'OCP ORV3',
      drawing_ref: 'DWG-ORV3-001',
      critical_item: true
    },
    {
      line_id: 2,
      parent_line_id: 1,
      level: 1,
      category: 'Door',
      item_code: 'DR-FRONT-MESH',
      item_name: 'Front Perforated Door',
      specification: '80% airflow, combo lock',
      qty_per_fg: 1,
      uom: 'Nos',
      make_buy_flag: 'BUY',
      compliance: 'IEC',
      drawing_ref: 'DWG-DR-102',
      critical_item: false
    }
  ];

  scmLines: ScmLine[] = [
    {
      item_line_id: 1,
      source_type: 'MAKE',
      preferred_vendor: 'TIERX_FACTORY',
      alternate_vendor: '—',
      moq: 1,
      lead_time_days: 25,
      import_flag: false,
      single_source_risk: false,
      availability_status: 'Available',
      remarks: 'In-house fabrication'
    },
    {
      item_line_id: 2,
      source_type: 'BUY',
      preferred_vendor: 'VENDOR-A',
      alternate_vendor: 'VENDOR-B',
      moq: 10,
      lead_time_days: 20,
      import_flag: false,
      single_source_risk: false,
      availability_status: 'Long Lead',
      remarks: 'Confirm lock type availability'
    }
  ];

  costLines: CostLine[] = [
    {
      item_line_id: 1,
      estimated_unit_cost: 12000,
      tooling_cost: 0,
      bought_out_cost: 0,
      labor_cost: 2500,
      overhead_cost: 1800,
      estimated_total_cost: 16300
    },
    {
      item_line_id: 2,
      estimated_unit_cost: 3500,
      tooling_cost: 0,
      bought_out_cost: 3500,
      labor_cost: 0,
      overhead_cost: 500,
      estimated_total_cost: 4000
    }
  ];

  costSummary: CostSummary = {
    total_estimated_cost: 520000,
    final_price: 620000,
    gross_margin_pct: 18
  };

  servicesDelivery: ServicesDelivery = {
    installation_required: 'Yes',
    commissioning_required: 'Yes',
    site_supervision_days: '5',
    training_required: 'Yes',
    warranty_period: '24 months',
    amc_option: '24x7, 4hr response'
  };

  workflowStatus = {
    current_status: 'DRAFT',
    pending_with: 'Sales',
  };

  approvalLog: ApprovalLog[] = [
    { date: '2026-01-25', action: 'CREATE_PRE_BOM', from: 'Sales', to: 'Sales', remarks: 'Auto-created from requirements' },
    { date: '2026-01-26', action: 'SUBMIT_TO_ENGINEERING', from: 'Sales', to: 'Engineering', remarks: 'Ready for config' },
  ];

  attachments: string[] = ['Requirements.pdf', 'Engineering drawings.zip', 'Costing worksheet.xlsx'];

  ngOnInit(): void {
    let isNewMode = false;
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('mode') === 'new') {
        isNewMode = true;
        this.resetForm();
      }
    });

    this.requirementOptions = this.preBomStore.getRequirementSnapshots();
    if (!isNewMode && this.requirementOptions.length > 0) {
      this.selectedOpportunityId = this.requirementOptions[0].opportunity_id;
      this.requirementSnapshot = { ...this.requirementOptions[0] };
    }
  }

  get totalCost(): number {
    return this.costSummary.total_estimated_cost;
  }

  isReadOnlyFor(role: Role, allowed: Role[]): boolean {
    return !allowed.includes(role);
  }

  addFinishedGood(): void {
    const nextLine = this.finishedGoods.length + 1;
    this.finishedGoods = [
      ...this.finishedGoods,
      {
        line_no: nextLine,
        product_family: '',
        product_model: '',
        description: '',
        quantity: 1,
        uom: 'Nos',
        config_summary: '',
        target_unit_price: undefined,
        target_lead_time_weeks: undefined
      }
    ];
  }

  removeFinishedGood(index: number): void {
    const confirmed = window.confirm('Delete this finished good line?');
    if (!confirmed) {
      return;
    }
    this.finishedGoods = this.finishedGoods.filter((_, idx) => idx !== index);
  }

  addEngineeringItem(): void {
    const nextLine = this.engineeringItems.length + 1;
    this.engineeringItems = [
      ...this.engineeringItems,
      {
        line_id: nextLine,
        parent_line_id: null,
        level: 0,
        category: '',
        item_code: '',
        item_name: '',
        specification: '',
        qty_per_fg: 1,
        uom: 'Nos',
        make_buy_flag: '',
        compliance: '',
        drawing_ref: '',
        critical_item: false
      }
    ];
  }

  removeEngineeringItem(index: number): void {
    const confirmed = window.confirm('Delete this engineering line?');
    if (!confirmed) {
      return;
    }
    this.engineeringItems = this.engineeringItems.filter((_, idx) => idx !== index);
  }

  addScmLine(): void {
    const nextLine = this.scmLines.length + 1;
    this.scmLines = [
      ...this.scmLines,
      {
        item_line_id: nextLine,
        source_type: '',
        preferred_vendor: '',
        alternate_vendor: '',
        moq: 1,
        lead_time_days: 0,
        import_flag: false,
        single_source_risk: false,
        availability_status: '',
        remarks: ''
      }
    ];
  }

  removeScmLine(index: number): void {
    const confirmed = window.confirm('Delete this SCM line?');
    if (!confirmed) {
      return;
    }
    this.scmLines = this.scmLines.filter((_, idx) => idx !== index);
  }

  addCostLine(): void {
    const nextLine = this.costLines.length + 1;
    this.costLines = [
      ...this.costLines,
      {
        item_line_id: nextLine,
        estimated_unit_cost: 0,
        tooling_cost: 0,
        bought_out_cost: 0,
        labor_cost: 0,
        overhead_cost: 0,
        estimated_total_cost: 0
      }
    ];
  }

  removeCostLine(index: number): void {
    const confirmed = window.confirm('Delete this cost line?');
    if (!confirmed) {
      return;
    }
    this.costLines = this.costLines.filter((_, idx) => idx !== index);
  }

  cancelEdit(): void {
    const confirmed = window.confirm('Cancel changes and leave the page?');
    if (!confirmed) {
      return;
    }
    window.history.back();
  }

  saveDraft(): void {
    if (this.selectedOpportunityId) {
      this.preBomStore.updateRecordDetails(this.selectedOpportunityId, {
        snapshot: this.requirementSnapshot,
        finishedGoods: this.finishedGoods
      });
    }
    window.alert('Draft saved (mock).');
  }

  submitForNext(): void {
    const confirmed = window.confirm('Submit this Pre-BOM to the next workflow stage?');
    if (!confirmed) {
      return;
    }
    this.preBomHeader.status = 'APPROVED_FOR_QUOTE';
    window.alert('Pre-BOM approved for quotation.');
    if (this.selectedOpportunityId) {
      this.preBomStore.updateStatusByOpportunity(this.selectedOpportunityId, 'APPROVED_FOR_QUOTE');
      this.preBomStore.updateRecordDetails(this.selectedOpportunityId, {
        snapshot: this.requirementSnapshot,
        finishedGoods: this.finishedGoods
      });
    }
    this.workflowStatus = {
      current_status: 'APPROVED_FOR_QUOTE',
      pending_with: 'Sales'
    };
    window.history.back();
  }

  resetForm(): void {
    this.preBomHeader = {
      pre_bom_id: 'PBOM-NEW',
      revision: 'V1',
      status: 'DRAFT',
      currency: 'INR',
      target_selling_price: 0,
      expected_margin_pct: 0,
      quotation_validity: 0,
      expected_delivery_weeks: 0,
      delivery_location: '',
      incoterms: '',
      sales_notes: '',
      special_conditions: ''
    };

    this.finishedGoods = [];
    this.engineeringConfig = {
      rack_height_u: '',
      rack_width_mm: '',
      rack_depth_mm: '',
      load_rating_kg: '',
      door_type: '',
      airflow_direction: '',
      color_finish: '',
      compliance_tags: '',
      pdu_type: '',
      pdu_phase: '',
      pdu_input_plug: '',
      pdu_outlet: '',
      pdu_metering: '',
      busbar_rating_a: '',
      busbar_length: '',
      busbar_redundancy: '',
      busbar_tapoff: ''
    };
    this.engineeringItems = [];
    this.scmLines = [];
    this.costLines = [];
    this.costSummary = {
      total_estimated_cost: 0,
      final_price: 0,
      gross_margin_pct: 0
    };
    this.servicesDelivery = {
      installation_required: '',
      commissioning_required: '',
      site_supervision_days: '',
      training_required: '',
      warranty_period: '',
      amc_option: ''
    };
    this.workflowStatus = {
      current_status: 'DRAFT',
      pending_with: 'Sales'
    };
    this.approvalLog = [];
    this.attachments = [];
    this.selectedOpportunityId = '';
    this.requirementSnapshot = {
      customer_name: '',
      opportunity_id: '',
      project_name: '',
      site_location: '',
      segment: '',
      product_families_required: '',
      rack_count: 0,
      it_load_per_rack: 0,
      redundancy: '',
      compliance: '',
      target_delivery_date: '',
      attachments: []
    };
  }

  onOpportunitySelect(): void {
    const selected = this.requirementOptions.find(
      (option) => option.opportunity_id === this.selectedOpportunityId
    );
    if (!selected) {
      return;
    }
    this.requirementSnapshot = { ...selected };
    this.attachments = [...selected.attachments];
  }
}
