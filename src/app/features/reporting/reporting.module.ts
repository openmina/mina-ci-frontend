import { NgModule } from '@angular/core';

import { ReportingRouting } from './reporting.routing';
import { ReportingComponent } from './reporting.component';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ReportingEffects } from '@reporting/reporting.effects';
import { ReportingTableComponent } from './reporting-table/reporting-table.component';
import { ReportingSidePanelComponent } from './reporting-side-panel/reporting-side-panel.component';
import { MatIconModule } from '@angular/material/icon';
import { ReportingTooltipPipe } from '@reporting/reporting-table/reporting-table-tooltip.pipe';
import { ReportingTableGraphComponent } from './reporting-table-graph/reporting-table-graph.component';


@NgModule({
  declarations: [
    ReportingComponent,
    ReportingTableComponent,
    ReportingSidePanelComponent,
    ReportingTooltipPipe,
    ReportingTableGraphComponent,
  ],
  imports: [
    SharedModule,
    ReportingRouting,
    EffectsModule.forFeature([ReportingEffects]),
    MatIconModule,
  ],
})
export class ReportingModule {}
