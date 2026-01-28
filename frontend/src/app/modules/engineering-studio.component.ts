import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FinalBomRecord {
  id: string;
  salesOrderId: string;
  preBomId: string;
  status: string;
  revision: string;
  owner: string;
  updatedAt: string;
}

@Component({
  selector: 'app-engineering-studio',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './engineering-studio.component.html',
  styleUrl: './engineering-studio.component.scss'
})
export class EngineeringStudioComponent {
  records: FinalBomRecord[] = [
    {
      id: 'FBOM-2026-014',
      salesOrderId: 'SO-2026-021',
      preBomId: 'PBOM-2026-0007',
      status: 'ENGINEERING_IN_PROGRESS',
      revision: 'V1',
      owner: 'Engineering',
      updatedAt: '2026-01-27'
    },
    {
      id: 'FBOM-2026-015',
      salesOrderId: 'SO-2026-018',
      preBomId: 'PBOM-2026-0005',
      status: 'ENGINEERING_REVIEW',
      revision: 'V2',
      owner: 'Engineering Lead',
      updatedAt: '2026-01-26'
    },
    {
      id: 'FBOM-2026-016',
      salesOrderId: 'SO-2026-027',
      preBomId: 'PBOM-2026-0009',
      status: 'ENGINEERING_FROZEN',
      revision: 'V1',
      owner: 'Admin',
      updatedAt: '2026-01-24'
    }
  ];
}
