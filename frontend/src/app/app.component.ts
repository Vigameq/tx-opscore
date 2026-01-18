import { AfterViewInit, Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface Metric {
  value: string;
  label: string;
}

interface PipelineStep {
  title: string;
  meta: string;
}

interface ModuleCard {
  icon: string;
  name: string;
  description: string;
  tags: string[];
}

interface WorkflowColumn {
  title: string;
  items: string[];
}

interface ImpactStat {
  label: string;
  value: string;
  meta: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  heroMetrics: Metric[] = [
    { value: '12', label: 'apps live' },
    { value: '6', label: 'modules' },
    { value: '99.2%', label: 'on-time delivery' }
  ];

  pipelineSteps: PipelineStep[] = [
    { title: 'Outreach', meta: '96 active leads' },
    { title: 'Requirements', meta: '42 specs in review' },
    { title: 'SCM Planning', meta: '18 builds queued' },
    { title: 'Delivery', meta: '6 shipments today' }
  ];

  modules: ModuleCard[] = [
    {
      icon: 'OR',
      name: 'Outreach Radar',
      description: 'Segment accounts, track touchpoints, and move signals into demand.',
      tags: ['Live', 'CRM sync']
    },
    {
      icon: 'RC',
      name: 'Requirement Capture',
      description: 'Structured intake, discovery playbooks, and stakeholder alignment.',
      tags: ['Live', 'Templates']
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

  workflowColumns: WorkflowColumn[] = [
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

  impactStats: ImpactStat[] = [
    { label: 'Velocity', value: '-32%', meta: 'Cycle time reduction' },
    { label: 'Accuracy', value: '+21%', meta: 'Forecast confidence' },
    { label: 'Efficiency', value: '$1.8M', meta: 'Annualized savings' }
  ];

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
