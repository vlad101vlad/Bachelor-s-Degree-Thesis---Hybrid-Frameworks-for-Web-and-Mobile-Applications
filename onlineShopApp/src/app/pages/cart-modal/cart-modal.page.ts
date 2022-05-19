import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
  cartItems = [];
  cartSum = 0;
  tip = 0;
  deliveryFee = 2.5;
  serviceFee = 0.65;

  constructor(
    private cartService: CartService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.refreshCart();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  removeTip() {
    if(this.tip > 0) {
      this.tip -= 0.5;
    }
  }

  addTip() {
    this.tip += 0.5;
  }

  remove(itemToBeRemoved) {
    this.cartService.removeProduct(itemToBeRemoved);
    this.refreshCart();
  }

  feeInfo($event: any) {

  }

  private computeCartSum(){
    this.cartSum = this.cartItems.reduce((value, item) => (value += item.amount * item.price), 0);
  }

  private refreshCart() {
    this.cartItems = this.cartService.getCart();
    this.computeCartSum();
  }
}
