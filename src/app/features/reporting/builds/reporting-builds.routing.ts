import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingBuildsComponent } from '@reporting/builds/reporting-builds.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingBuildsComponent,
    children: [
      {
        path: ':id',
        component: ReportingBuildsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingBuildsRouting {}
