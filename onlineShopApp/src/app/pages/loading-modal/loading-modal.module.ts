import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingModalPageRoutingModule } from './loading-modal-routing.module';

import { LoadingModalPage } from './loading-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingModalPageRoutingModule
  ],
  declarations: [LoadingModalPage]
})
export class LoadingModalPageModule {}
