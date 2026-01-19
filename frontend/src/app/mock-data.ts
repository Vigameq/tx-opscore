export interface Metric {
  value: string;
  label: string;
}

export interface PipelineStep {
  title: string;
  meta: string;
}

export interface ModuleCard {
  icon: string;
  name: string;
  description: string;
  tags: string[];
  route?: string;
}

export interface WorkflowColumn {
  title: string;
  items: string[];
}

export interface ImpactStat {
  label: string;
  value: string;
  meta: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  customer: string;
  owner: string;
  status: string;
}

export interface Opportunity {
  id: string;
  projectId: string;
  name: string;
  stage: string;
  source: string;
  value: number;
  updatedAt: string;
}

export const HERO_METRICS: Metric[] = [
  { value: '12', label: 'apps live' },
  { value: '6', label: 'modules' },
  { value: '99.2%', label: 'on-time delivery' }
];

export const PIPELINE_STEPS: PipelineStep[] = [
  { title: 'Outreach', meta: '96 active leads' },
  { title: 'Requirements', meta: '42 specs in review' },
  { title: 'SCM Planning', meta: '18 builds queued' },
  { title: 'Delivery', meta: '6 shipments today' }
];

export const MODULES: ModuleCard[] = [
  {
    icon: 'OR',
    name: 'Outreach Radar',
    description: 'Segment accounts, track touchpoints, and move signals into demand.',
    tags: ['Live', 'CRM sync'],
    route: '/modules/outreach-radar'
  },
  {
    icon: 'RC',
    name: 'Requirement Capture',
    description: 'Structured intake, discovery playbooks, and stakeholder alignment.',
    tags: ['Live', 'Templates'],
    route: '/modules/requirement-capture'
  },
  {
    icon: 'SO',
    name: 'Solution Studio',
    description: 'Design solutions with costing, feasibility, and risk overlays.',
    tags: ['Beta', 'Configurable']
  },
  {
    icon: 'SC',
    name: 'SCM Planner',
    description: 'Plan inventory, suppliers, and lead times with scenario views.',
    tags: ['Live', 'Forecasting']
  },
  {
    icon: 'PR',
    name: 'Production Pulse',
    description: 'Manage builds, quality gates, and real-time capacity insights.',
    tags: ['Live', 'Factory-ready']
  },
  {
    icon: 'DL',
    name: 'Delivery Logistics',
    description: 'Orchestrate shipments, milestones, and last-mile visibility.',
    tags: ['Live', 'GPS feeds']
  },
  {
    icon: 'CL',
    name: 'Closure Desk',
    description: 'Confirm sign-off, handover documentation, and renewal paths.',
    tags: ['Live', 'Retention']
  },
  {
    icon: 'IN',
    name: 'Integrations Hub',
    description: 'Connect ERP, CRM, and shipping tools without custom code.',
    tags: ['Beta', 'API']
  }
];

export const WORKFLOW_COLUMNS: WorkflowColumn[] = [
  {
    title: 'Frontline',
    items: ['Outreach Radar', 'Requirement Capture']
  },
  {
    title: 'Core ops',
    items: ['Solution Studio', 'SCM Planner']
  },
  {
    title: 'Delivery',
    items: ['Production Pulse', 'Delivery Logistics']
  },
  {
    title: 'Finish',
    items: ['Closure Desk', 'Insights Atlas']
  }
];

export const IMPACT_STATS: ImpactStat[] = [
  { label: 'Velocity', value: '-32%', meta: 'Cycle time reduction' },
  { label: 'Accuracy', value: '+21%', meta: 'Forecast confidence' },
  { label: 'Efficiency', value: '$1.8M', meta: 'Annualized savings' }
];

export const OUTREACH_PROJECTS: ProjectSummary[] = [
  {
    id: 'proj-001',
    name: 'Apollo Retail Expansion',
    customer: 'Apollo Retail',
    owner: 'Ananya Rao',
    status: 'Active'
  },
  {
    id: 'proj-002',
    name: 'Nimbus Warehouse Upgrade',
    customer: 'Nimbus Logistics',
    owner: 'Rahul Mehta',
    status: 'Discovery'
  },
  {
    id: 'proj-003',
    name: 'Helios Supply Refresh',
    customer: 'Helios Energy',
    owner: 'Sana Patel',
    status: 'Proposal'
  }
];

export const OUTREACH_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1001',
    projectId: 'proj-001',
    name: 'Store rollout phase 1',
    stage: 'Qualified',
    source: 'Referral',
    value: 420000,
    updatedAt: '2025-01-05'
  },
  {
    id: 'opp-1002',
    projectId: 'proj-001',
    name: 'Smart shelving pilot',
    stage: 'Proposal',
    source: 'Event',
    value: 180000,
    updatedAt: '2025-01-12'
  },
  {
    id: 'opp-2001',
    projectId: 'proj-002',
    name: 'Automation audit',
    stage: 'Requirement Gathering',
    source: 'Inbound',
    value: 95000,
    updatedAt: '2025-01-09'
  },
  {
    id: 'opp-3001',
    projectId: 'proj-003',
    name: 'Fleet replacement program',
    stage: 'Negotiation',
    source: 'Event',
    value: 610000,
    updatedAt: '2025-01-16'
  }
];
