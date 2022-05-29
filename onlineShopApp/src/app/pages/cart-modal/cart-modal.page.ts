import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {ModalController, Platform} from '@ionic/angular';
import {CartDto} from '../../services/model/cart-dto';
import {CartProductDto} from '../../services/model/cart-product-dto';

const TIP_AMOUNT = 0.5;

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
  cart: CartDto = null;
  cartSum = 0;
  deliveryFee = 2.5;
  serviceFee = 0.65;

  constructor(
    private cartService: CartService,
    private platform: Platform,
    private modalController: ModalController
  ) {
    this.platform.ready().then(() => {
      this.loadCardInformation();
    });
  }

  ngOnInit() {
    this.subscribeToRefresh();
  }

  // Observable subscritions
  subscribeToRefresh() {
    this.cartService.getCartRefresh().subscribe(() => {
      this.loadCardInformation();
    });
  }

  // CRUD Operations
  loadCardInformation() {
    this.cartService.getCart().then((response) => {
      this.cart = CartService.mapCartDtoStringyfiedToCartDTO(response.value);
      this.computeCartSum();
    });
  }

  addTip() {
    this.cartService.updateTip(TIP_AMOUNT).then(() => {
      this.cartService.notifyCartNeedsRefresh();
    });
  }

  removeTip() {
    this.cartService.updateTip(-TIP_AMOUNT).then(() => {
      this.cartService.notifyCartNeedsRefresh();
    });
  }


  remove(itemToBeRemoved) {
    this.cartService.removeProduct(itemToBeRemoved).then((product) => {
      this.cartService.showToast('Product was removed from the cart');
      this.cartService.notifyCartNeedsRefresh();
    });
  }


  feeInfo($event: any) {

  }

  // Template helper functions
  computePriceForItem(item: CartProductDto) {
    return Number(item.price) * Number(item.amount);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  private computeCartSum() {
    this.cartSum = 0;
    this.cart.products.forEach(product => {
      this.cartSum += Number(product.amount) * Number(product.price);
    });
    this.cartSum += Number(this.cart.raiderTip) + this.serviceFee + this.deliveryFee;
  }
}
