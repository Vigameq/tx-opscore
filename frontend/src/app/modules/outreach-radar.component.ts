import { AfterViewInit, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

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
  imports: [NgFor, RouterLink],
  templateUrl: './outreach-radar.component.html',
  styleUrl: './outreach-radar.component.scss'
})
export class OutreachRadarComponent implements AfterViewInit {
  pipelineTitle = 'Lead to Opportunity Pipeline';

  stages: PipelineStage[] = [
    { name: 'New', description: 'Inbound lead captured and tagged.' },
    { name: 'Qualified', description: 'Scored and ready for discovery.' },
    { name: 'Requirement Gathering', description: 'Stakeholders aligned on needs.' },
    { name: 'Proposal', description: 'Solution and commercial terms drafted.' },
    { name: 'Negotiation', description: 'Risk, price, and scope finalized.' },
    { name: 'PO', description: 'Purchase order secured.' },
    { name: 'Execution', description: 'Handoff to delivery workflow.' },
  ];

  sources: SourceMetric[] = [
    { source: 'Event', share: '38%', note: 'Conference + roadshow leads.' },
    { source: 'Referral', share: '27%', note: 'Partner + customer intros.' },
    { source: 'Inbound', share: '35%', note: 'Website + content capture.' },
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
