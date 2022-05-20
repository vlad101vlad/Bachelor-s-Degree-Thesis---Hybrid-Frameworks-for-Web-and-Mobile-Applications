import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {ModalController} from '@ionic/angular';
import {CartDto} from '../../services/model/cart-dto';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
  cartItems = [];
  cart: CartDto = null;
  cartSum = 0;
  deliveryFee = 2.5;
  serviceFee = 0.65;

  cartProductsLoaded: boolean;

  constructor(
    private cartService: CartService,
    private modalController: ModalController
  ) {
  }

  ngOnInit() {
    this.refreshCart();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  removeTip() {
    // if(this.tip > 0) {
    //   this.tip -= 0.5;
    // }
  }

  addTip() {
    // this.tip += 0.5;
  }

  remove(itemToBeRemoved) {
    this.cartService.removeProduct(itemToBeRemoved);
    this.refreshCart();
  }

  feeInfo($event: any) {

  }

  private computeCartSum() {
    this.cart.products.forEach(product => {
      this.cartSum += Number(product.amount) * Number(product.price);
    });
    this.cartSum += Number(this.cart.raiderTip) + this.serviceFee + this.deliveryFee;
  }

  private async refreshCart() {
    this.cartService.getCartFromStorage().then((cartFromStorage => {
      this.cart = cartFromStorage;
      this.cartItems = this.cartService.getCart();
      this.computeCartSum();

      this.cartProductsLoaded = true;
    }));
  }
}
