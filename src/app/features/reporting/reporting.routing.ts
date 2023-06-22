import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from '@reporting/reporting.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: 'builds',
        loadChildren: () => import('./builds/reporting-builds.module').then(m => m.ReportingBuildsModule),
      },
      {
        path: 'compare',
        loadChildren: () => import('./compare/reporting-compare.module').then(m => m.ReportingCompareModule),
      },
      {
        path: 'trends',
        loadChildren: () => import('./dashboard/reporting-dashboard.module').then(m => m.ReportingDashboardModule),
      },
      {
        path: '**',
        redirectTo: 'builds',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRouting {}
