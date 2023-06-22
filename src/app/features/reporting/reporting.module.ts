import { NgModule } from '@angular/core';

import { ReportingRouting } from './reporting.routing';
import { ReportingComponent } from './reporting.component';


@NgModule({
  declarations: [
    ReportingComponent,
  ],
  imports: [
    ReportingRouting,
  ],
})
export class ReportingModule {}
