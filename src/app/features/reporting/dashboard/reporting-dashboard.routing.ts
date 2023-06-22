import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingDashboardComponent } from '@reporting/dashboard/reporting-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingDashboardComponent,
    children: [
      {
        path: ':id',
        component: ReportingDashboardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingDashboardRouting {}
