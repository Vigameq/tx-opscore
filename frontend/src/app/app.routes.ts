import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OutreachRadarComponent } from './modules/outreach-radar.component';
import { RequirementCaptureComponent } from './modules/requirement-capture.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'modules/outreach-radar', component: OutreachRadarComponent },
  { path: 'modules/requirement-capture', component: RequirementCaptureComponent },
];
