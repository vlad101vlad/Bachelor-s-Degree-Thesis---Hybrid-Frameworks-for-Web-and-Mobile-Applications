import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {SharedService} from '../../services/shared.service';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.page.html',
  styleUrls: ['./loading-modal.page.scss'],
})
export class LoadingModalPage implements OnInit {

  uploadProgress$: Observable<number>;


  constructor(
    private modalController: ModalController,
    private sharedService: SharedService
  ) {
    this.uploadProgress$ = sharedService.uploadProgress$;
  }

  ngOnInit() {
  }


  dismiss() {
    this.modalController.dismiss();
  }
}
