import { Injectable } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LoadingModalPage} from '../pages/loading-modal/loading-modal.page';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  uploadProgress$: Observable<number>;

  constructor(
    private modalController: ModalController
  ) {
    this.uploadProgress$ = null;
  }

  async openLoadingModal() {
    const modal = await this.modalController.create({
      component: LoadingModalPage,
      cssClass: 'custom-modal'
    });

    await modal.present();
  }
}
