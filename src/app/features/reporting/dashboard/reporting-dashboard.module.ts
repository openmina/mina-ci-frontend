import { NgModule } from '@angular/core';
import { ReportingDashboardComponent } from './reporting-dashboard.component';
import { ReportingDashboardGraphListComponent } from './reporting-dashboard-graph-list/reporting-dashboard-graph-list.component';
import { ReportingDashboardSidePanelComponent } from './reporting-dashboard-side-panel/reporting-dashboard-side-panel.component';
import { ReportingDashboardGraphComponent } from './reporting-dashboard-graph/reporting-dashboard-graph.component';
import { ReportingDashboardRouting } from '@reporting/dashboard/reporting-dashboard.routing';
import { SharedModule } from '@shared/shared.module';
import { ReportingSharedModule } from '@reporting/shared/reporting-shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ReportingDashboardEffects } from '@reporting/dashboard/reporting-dashboard.effects';


@NgModule({
  declarations: [
    ReportingDashboardComponent,
    ReportingDashboardGraphListComponent,
    ReportingDashboardSidePanelComponent,
    ReportingDashboardGraphComponent,
  ],
  imports: [
    SharedModule,
    ReportingSharedModule,
    ReportingDashboardRouting,
    EffectsModule.forFeature([ReportingDashboardEffects]),
  ],
})
export class ReportingDashboardModule {}
