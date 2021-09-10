import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultDashboardPage } from './result-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: ResultDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultDashboardPageRoutingModule {}
