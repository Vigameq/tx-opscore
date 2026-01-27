import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OutreachRadarComponent } from './modules/outreach-radar.component';
import { RequirementCaptureComponent } from './modules/requirement-capture.component';
import { PreBomQuotationComponent } from './modules/pre-bom-quotation.component';
import { PreBomFormComponent } from './modules/pre-bom-form.component';
import { SalesOrderPoComponent } from './modules/sales-order-po.component';
import { PoIntakeComponent } from './modules/po-intake.component';
import { SalesOrderDetailComponent } from './modules/sales-order-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'modules/outreach-radar', component: OutreachRadarComponent },
  { path: 'modules/requirement-capture', component: RequirementCaptureComponent },
  { path: 'modules/pre-bom-quotation', component: PreBomQuotationComponent },
  { path: 'modules/pre-bom-form', component: PreBomFormComponent },
  { path: 'modules/sales-order-po', component: SalesOrderPoComponent },
  { path: 'Sales Order & PO Management/po-intake/:quotationId', component: PoIntakeComponent },
  { path: 'sales-order/:salesOrderId', component: SalesOrderDetailComponent },
];
