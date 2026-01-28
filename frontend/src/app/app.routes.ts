import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OutreachRadarComponent } from './modules/outreach-radar.component';
import { RequirementCaptureComponent } from './modules/requirement-capture.component';
import { PreBomQuotationComponent } from './modules/pre-bom-quotation.component';
import { PreBomFormComponent } from './modules/pre-bom-form.component';
import { SalesOrderPoComponent } from './modules/sales-order-po.component';
import { PoIntakeComponent } from './modules/po-intake.component';
import { SalesOrderDetailComponent } from './modules/sales-order-detail.component';
import { EngineeringStudioComponent } from './modules/engineering-studio.component';
import { FinalBomDetailComponent } from './modules/final-bom-detail.component';
import { ScmPlannerComponent } from './modules/scm-planner.component';
import { MrpRunComponent } from './modules/mrp-run.component';
import { PurchaseRequisitionComponent } from './modules/purchase-requisition.component';
import { RfqManagementComponent } from './modules/rfq-management.component';
import { WorkOrderListComponent } from './modules/work-order-list.component';
import { WorkOrderDetailComponent } from './modules/work-order-detail.component';
import { PackingListComponent } from './modules/packing-list.component';
import { PackingDetailComponent } from './modules/packing-detail.component';
import { ShipmentDetailComponent } from './modules/shipment-detail.component';
import { FeedbackDashboardComponent } from './modules/feedback-dashboard.component';
import { FeedbackDetailComponent } from './modules/feedback-detail.component';
import { FeedbackFormComponent } from './modules/feedback-form.component';
import { ExecutiveDashboardComponent } from './modules/executive-dashboard.component';
import { ImprovementTrackerComponent } from './modules/improvement-tracker.component';
import { ImprovementDetailComponent } from './modules/improvement-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'modules/outreach-radar', component: OutreachRadarComponent },
  { path: 'modules/requirement-capture', component: RequirementCaptureComponent },
  { path: 'modules/pre-bom-quotation', component: PreBomQuotationComponent },
  { path: 'modules/pre-bom-form', component: PreBomFormComponent },
  { path: 'modules/sales-order-po', component: SalesOrderPoComponent },
  { path: 'engineering studio', component: EngineeringStudioComponent },
  { path: 'engineering studio/final-bom/:finalBomId', component: FinalBomDetailComponent },
  { path: 'modules/scm-planner', component: ScmPlannerComponent },
  { path: 'production/work-orders', component: WorkOrderListComponent },
  { path: 'production/work-order/:workOrderId', component: WorkOrderDetailComponent },
  { path: 'logistics/packing', component: PackingListComponent },
  { path: 'logistics/packing/:id', component: PackingDetailComponent },
  { path: 'logistics/shipment/:shipmentId', component: ShipmentDetailComponent },
  { path: 'quality/feedback', component: FeedbackDashboardComponent },
  { path: 'quality/feedback/:feedbackId', component: FeedbackDetailComponent },
  { path: 'feedback/:secureToken', component: FeedbackFormComponent },
  { path: 'executive/dashboard', component: ExecutiveDashboardComponent },
  { path: 'quality/improvements', component: ImprovementTrackerComponent },
  { path: 'quality/improvement/:improvementId', component: ImprovementDetailComponent },
  { path: 'planning/mrp/:finalBomId', component: MrpRunComponent },
  { path: 'procurement/pr/:mrpId', component: PurchaseRequisitionComponent },
  { path: 'procurement/rfq/:prId', component: RfqManagementComponent },
  { path: 'Sales Order & PO Management/po-intake/:quotationId', component: PoIntakeComponent },
  { path: 'sales-order/:salesOrderId', component: SalesOrderDetailComponent },
];
