import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
  cart = [];
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
    this.cartItems = this.cartService.getCart();
    this.cartSum = this.cartItems.reduce((value, item) => (value += item.amount * item.price), 0);
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
    this.cart = this.cart.filter(item => item.id !== itemToBeRemoved.id);
    this.cartSum = this.cart.reduce((value, item) => value += item.price, 0);
  }

  feeInfo($event: any) {

  }
}
