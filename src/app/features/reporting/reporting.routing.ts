import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from '@reporting/reporting.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    children: [
      {
        path: ':id',
        component: ReportingComponent,
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRouting {}
