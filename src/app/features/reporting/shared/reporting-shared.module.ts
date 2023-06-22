import { NgModule } from '@angular/core';
import { ReportingDetailComponent } from '@reporting/shared/reporting-detail/reporting-detail.component';
import {
  ReportingDetailActiveBlockComponent,
} from '@reporting/shared/reporting-detail-active-block/reporting-detail-active-block.component';
import { ReportingDetailBlockListComponent } from '@reporting/shared/reporting-detail-block-list/reporting-detail-block-list.component';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ReportingGraphComponent } from '@reporting/shared/reporting-graph/reporting-graph.component';
import { RouterLink } from '@angular/router';


@NgModule({
  declarations: [
    ReportingDetailComponent,
    ReportingDetailBlockListComponent,
    ReportingDetailActiveBlockComponent,
    ReportingGraphComponent,
  ],
  imports: [
    SharedModule,
    MatIconModule,
    RouterLink,
  ],
  exports: [
    ReportingDetailComponent,
    ReportingGraphComponent,
    MatIconModule,
  ],
})
export class ReportingSharedModule {}
