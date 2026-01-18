import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OutreachRadarComponent } from './modules/outreach-radar.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'modules/outreach-radar', component: OutreachRadarComponent },
];
