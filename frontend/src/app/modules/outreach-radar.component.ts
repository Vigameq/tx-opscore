import { AfterViewInit, Component } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  OUTREACH_OPPORTUNITIES,
  OUTREACH_PROJECTS,
  Opportunity,
  ProjectSummary,
} from '../mock-data';

interface PipelineStage {
  name: string;
  description: string;
}

interface SourceMetric {
  source: string;
  share: string;
  note: string;
}

@Component({
  selector: 'app-outreach-radar',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule, DecimalPipe],
  templateUrl: './outreach-radar.component.html',
  styleUrl: './outreach-radar.component.scss'
})
export class OutreachRadarComponent implements AfterViewInit {
  pipelineTitle = 'Lead to Opportunity Pipeline';
  stageNames = [
    'New',
    'Qualified',
    'Requirement Gathering',
    'Proposal',
    'Negotiation',
    'PO',
    'Execution',
  ];
  sources = [
    'Event',
    'Referral',
    'Inbound',
  ];
  projectStatuses = [
    'Discovery',
    'Active',
    'Proposal',
    'Negotiation',
    'On Hold',
  ];

  stages: PipelineStage[] = [
    { name: 'New', description: 'Inbound lead captured and tagged.' },
    { name: 'Qualified', description: 'Scored and ready for discovery.' },
    { name: 'Requirement Gathering', description: 'Stakeholders aligned on needs.' },
    { name: 'Proposal', description: 'Solution and commercial terms drafted.' },
    { name: 'Negotiation', description: 'Risk, price, and scope finalized.' },
    { name: 'PO', description: 'Purchase order secured.' },
    { name: 'Execution', description: 'Handoff to delivery workflow.' },
  ];

  sourceMetrics: SourceMetric[] = [
    { source: 'Event', share: '38%', note: 'Conference + roadshow leads.' },
    { source: 'Referral', share: '27%', note: 'Partner + customer intros.' },
    { source: 'Inbound', share: '35%', note: 'Website + content capture.' },
  ];

  projects: ProjectSummary[] = OUTREACH_PROJECTS;
  opportunities: Opportunity[] = [...OUTREACH_OPPORTUNITIES];
  selectedProjectId = this.projects[0]?.id ?? '';

  newOpportunity = {
    name: '',
    stage: 'New',
    source: 'Inbound',
    value: 0,
  };

  newProject = {
    name: '',
    customer: '',
    owner: '',
    note: '',
    status: 'Discovery',
  };

  stageTargets = [
    { stage: 'New', slaDays: 2, targetConversion: '65%' },
    { stage: 'Qualified', slaDays: 5, targetConversion: '48%' },
    { stage: 'Requirement Gathering', slaDays: 7, targetConversion: '40%' },
    { stage: 'Proposal', slaDays: 10, targetConversion: '32%' },
    { stage: 'Negotiation', slaDays: 8, targetConversion: '22%' },
    { stage: 'PO', slaDays: 5, targetConversion: '18%' },
    { stage: 'Execution', slaDays: 3, targetConversion: '15%' },
  ];

  showProjectModal = false;
  showOpportunityModal = false;
  selectedStageFilter = 'All';
  stageFilterLocked = false;

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

  get activeProject(): ProjectSummary | undefined {
    return this.projects.find((project) => project.id === this.selectedProjectId);
  }

  get filteredOpportunities(): Opportunity[] {
    return this.opportunities.filter(
      (opportunity) => opportunity.projectId === this.selectedProjectId
    );
  }

  get stageCounts(): Array<{ stage: string; count: number }> {
    return this.stageNames.map((stage) => ({
      stage,
      count: this.filteredOpportunities.filter(
        (opportunity) => opportunity.stage === stage
      ).length,
    }));
  }

  get modalOpportunities(): Opportunity[] {
    const matchesStage = (opportunity: Opportunity) =>
      this.selectedStageFilter === 'All' || opportunity.stage === this.selectedStageFilter;

    return this.opportunities.filter(matchesStage);
  }

  get modalProjects(): Array<ProjectSummary & { opportunityCount: number; totalValue: number }> {
    const grouped = new Map<string, { count: number; value: number }>();

    this.modalOpportunities.forEach((opportunity) => {
      const entry = grouped.get(opportunity.projectId) || { count: 0, value: 0 };
      entry.count += 1;
      entry.value += opportunity.value;
      grouped.set(opportunity.projectId, entry);
    });

    return this.projects
      .filter((project) => grouped.has(project.id))
      .map((project) => {
        const summary = grouped.get(project.id) || { count: 0, value: 0 };
        return {
          ...project,
          opportunityCount: summary.count,
          totalValue: summary.value,
        };
      });
  }

  addOpportunity(): void {
    if (!this.newOpportunity.name.trim()) {
      return;
    }

    const nextId = `opp-${Date.now()}`;
    const opportunity: Opportunity = {
      id: nextId,
      projectId: this.selectedProjectId,
      name: this.newOpportunity.name.trim(),
      stage: this.newOpportunity.stage,
      source: this.newOpportunity.source,
      value: Number(this.newOpportunity.value) || 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    this.opportunities = [opportunity, ...this.opportunities];
    this.newOpportunity = {
      name: '',
      stage: 'New',
      source: 'Inbound',
      value: 0,
    };
  }

  addProject(): void {
    if (!this.newProject.name.trim() || !this.newProject.customer.trim()) {
      return;
    }

    const noteWords = this.countWords(this.newProject.note);
    if (noteWords > 100) {
      window.alert('Notes are limited to 100 words.');
      return;
    }

    const id = `proj-${Date.now()}`;
    const project: ProjectSummary = {
      id,
      name: this.newProject.name.trim(),
      customer: this.newProject.customer.trim(),
      owner: this.newProject.owner.trim() || 'Unassigned',
      status: this.newProject.status,
    };

    this.projects = [project, ...this.projects];
    this.selectedProjectId = project.id;
    this.newProject = {
      name: '',
      customer: '',
      owner: '',
      note: '',
      status: 'Discovery',
    };
    this.showProjectModal = false;
  }

  openProjectModal(): void {
    this.showProjectModal = true;
  }

  countWords(text: string): number {
    return text.trim().length === 0
      ? 0
      : text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  }

  openOpportunityModal(): void {
    this.showOpportunityModal = true;
    this.selectedStageFilter = 'All';
    this.stageFilterLocked = false;
  }

  closeModals(): void {
    this.showProjectModal = false;
    this.showOpportunityModal = false;
    this.stageFilterLocked = false;
  }

  openStageFilter(stage: string): void {
    this.selectedStageFilter = stage;
    this.showOpportunityModal = true;
    this.stageFilterLocked = true;
  }
}
