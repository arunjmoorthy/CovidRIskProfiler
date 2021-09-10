import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultDashboardPageRoutingModule } from './result-dashboard-routing.module';

import { ResultDashboardPage } from './result-dashboard.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    ResultDashboardPageRoutingModule
  ],
  declarations: [ResultDashboardPage]
})
export class ResultDashboardPageModule {}
