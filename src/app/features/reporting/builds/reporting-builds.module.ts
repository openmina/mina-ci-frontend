import { NgModule } from '@angular/core';

import { ReportingBuildsComponent } from './reporting-builds.component';
import { ReportingBuildsTableComponent } from './reporting-builds-table/reporting-builds-table.component';
import { ReportingBuildsRouting } from '@reporting/builds/reporting-builds.routing';
import { SharedModule } from '@shared/shared.module';
import { ReportingSharedModule } from '@reporting/shared/reporting-shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ReportingBuildsEffects } from '@reporting/builds/reporting-builds.effects';
import { ReportingBuildsTableTooltipPipe } from '@reporting/builds/reporting-builds-table/reporting-builds-table-tooltip.pipe';
import { ReportingBuildsSidePanelComponent } from './reporting-builds-side-panel/reporting-builds-side-panel.component';
import { ReportingBuildsToolbarComponent } from '@reporting/builds/reporting-builds-toolbar/reporting-builds-toolbar.component';


@NgModule({
  declarations: [
    ReportingBuildsComponent,
    ReportingBuildsTableComponent,
    ReportingBuildsTableTooltipPipe,
    ReportingBuildsSidePanelComponent,
    ReportingBuildsToolbarComponent,
  ],
  imports: [
    SharedModule,
    ReportingBuildsRouting,
    ReportingSharedModule,
    EffectsModule.forFeature([ReportingBuildsEffects]),
  ],
  exports: [
    ReportingBuildsSidePanelComponent,
  ],
})
export class ReportingBuildsModule {}
