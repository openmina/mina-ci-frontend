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
import { ReportingSidePanelBlockListComponent } from './reporting-side-panel-block-list/reporting-side-panel-block-list.component';
import { ReportingSidePanelActiveBlockComponent } from './reporting-side-panel-active-block/reporting-side-panel-active-block.component';
import { ReportingToolbarComponent } from './reporting-toolbar/reporting-toolbar.component';


@NgModule({
  declarations: [
    ReportingComponent,
    ReportingTableComponent,
    ReportingSidePanelComponent,
    ReportingTooltipPipe,
    ReportingTableGraphComponent,
    ReportingSidePanelBlockListComponent,
    ReportingSidePanelActiveBlockComponent,
    ReportingToolbarComponent,
  ],
  imports: [
    SharedModule,
    ReportingRouting,
    EffectsModule.forFeature([ReportingEffects]),
    MatIconModule,
  ],
})
export class ReportingModule {}
