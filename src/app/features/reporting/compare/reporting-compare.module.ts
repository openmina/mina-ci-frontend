import { NgModule } from '@angular/core';
import { ReportingCompareComponent } from './reporting-compare.component';
import { ReportingCompareRouting } from '@reporting/compare/reporting-compare.routing';
import { ReportingSharedModule } from '@reporting/shared/reporting-shared.module';
import { SharedModule } from '@shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ReportingCompareEffects } from '@reporting/compare/reporting-compare.effects';
import { ReportingCompareFirstSectionComponent } from './reporting-compare-first-section/reporting-compare-first-section.component';
import { ReportingCompareSecondSectionComponent } from './reporting-compare-second-section/reporting-compare-second-section.component';
import { ReportingCompareThirdSectionComponent } from './reporting-compare-third-section/reporting-compare-third-section.component';


@NgModule({
  declarations: [
    ReportingCompareComponent,
    ReportingCompareFirstSectionComponent,
    ReportingCompareSecondSectionComponent,
    ReportingCompareThirdSectionComponent,
  ],
  imports: [
    SharedModule,
    ReportingSharedModule,
    ReportingCompareRouting,
    EffectsModule.forFeature([ReportingCompareEffects]),
  ],
})
export class ReportingCompareModule {}
