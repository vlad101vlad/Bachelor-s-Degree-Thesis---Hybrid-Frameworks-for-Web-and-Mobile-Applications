import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadingModalPage } from './loading-modal.page';

const routes: Routes = [
  {
    path: '',
    component: LoadingModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadingModalPageRoutingModule {}
