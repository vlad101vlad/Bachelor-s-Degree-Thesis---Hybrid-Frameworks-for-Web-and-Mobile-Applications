import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CategoryEnum} from '../../services/model/category.enum';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {
  categories: any[];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.categories = this.getCategories();
  }

  selectCategory(chosedCategory) {
    this.modalController.dismiss({category: chosedCategory});
  }

  getCategories(): CategoryEnum[] {
    return Object.values(CategoryEnum);
  }
}
