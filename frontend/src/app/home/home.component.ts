import { AfterViewInit, Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  HERO_METRICS,
  IMPACT_STATS,
  MODULES,
  PIPELINE_STEPS,
  WORKFLOW_COLUMNS,
  ImpactStat,
  Metric,
  ModuleCard,
  PipelineStep,
  WorkflowColumn
} from '../mock-data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  modules: Array<ModuleCard & { route?: string }> = MODULES;
  projectId = '';
  selectedFile: File | null = null;
  uploadStatus = '';
  uploadKey = '';
  isUploading = false;

  heroMetrics: Metric[] = HERO_METRICS;
  pipelineSteps: PipelineStep[] = PIPELINE_STEPS;
  workflowColumns: WorkflowColumn[] = WORKFLOW_COLUMNS;
  impactStats: ImpactStat[] = IMPACT_STATS;

  constructor(private http: HttpClient, private router: Router) {}

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  async uploadFile(): Promise<void> {
    if (!this.projectId.trim()) {
      this.uploadStatus = 'Add a project ID before uploading.';
      return;
    }

    if (!this.selectedFile) {
      this.uploadStatus = 'Select a file to upload.';
      return;
    }

    this.isUploading = true;
    this.uploadStatus = 'Requesting upload URL...';
    this.uploadKey = '';

    try {
      const payload = {
        projectId: this.projectId.trim(),
        filename: this.selectedFile.name,
        contentType: this.selectedFile.type || 'application/octet-stream',
        size: this.selectedFile.size,
      };

      const response = await firstValueFrom(
        this.http.post<{ key?: string; uploadUrl?: string; disabled?: boolean; reason?: string }>(
          '/api/uploads/sign',
          payload
        )
      );

      if (response.disabled || !response.uploadUrl || !response.key) {
        this.uploadStatus =
          response.reason ||
          'Uploads are currently disabled. Configure Spaces to enable.';
        this.isUploading = false;
        return;
      }

      this.uploadStatus = 'Uploading to Spaces...';
      const uploadResult = await fetch(response.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type':
            this.selectedFile.type || 'application/octet-stream',
        },
        body: this.selectedFile,
      });

      if (!uploadResult.ok) {
        throw new Error('Upload failed. Check the file and try again.');
      }

      this.uploadKey = response.key;
      this.uploadStatus = 'Upload complete.';
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Upload failed unexpectedly.';
      this.uploadStatus = message;
    } finally {
      this.isUploading = false;
    }
  }

  onModuleClick(route?: string): void {
    if (route) {
      this.router.navigateByUrl(route);
    }
  }
}
