import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import categoriesData from '../../../assets/company/categories.json';
import {AnimationController, ModalController} from '@ionic/angular';
import {CartService} from '../../services/cart.service';
import {CartModalPage} from "../../pages/cart-modal/cart-modal.page";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('productButton', {read: ElementRef}) productButton: ElementRef;
  @ViewChild('cartButtonMobile', {read: ElementRef}) cartButtonMobile: ElementRef;
  @ViewChild('cartButtonWeb', {read: ElementRef}) cartButtonWeb: ElementRef;

  @Input() title: string;
  dropdown: boolean;
  categories = categoriesData;
  cartCount = 0;

  constructor(
    private animationController: AnimationController,
    private cartService: CartService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.cartService.getCartCount().subscribe((value => {
      if (value > 0) {
        this.animateCart();
      }
      this.cartCount = value;
    }));
  }

  hideDropdown(event) {
    const xTouch = event.clientX;
    const yTouch = event.clientY;
    const rect = this.productButton.nativeElement.getBoundingClientRect();
    const topBoundary = rect.top+2;
    const leftBoundary = rect.left+2;
    const rightBoundary = rect.right-2;
    if (xTouch < leftBoundary || xTouch > rightBoundary || yTouch < topBoundary) {
      this.dropdown = false;
    }

  }


  animateCart() {
    const keyframes = [
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(1.2)' },
      { offset: 0.8, transform: 'scale(0.9)' },
      { offset: 1, transform: 'scale(1)' },
    ];
    const cartAnimationWeb = this.animationController
      .create('web')
      .addElement(this.cartButtonWeb.nativeElement)
      .duration(600)
      .keyframes(keyframes);
    cartAnimationWeb.play();
    const cartAnimationMobile = this.animationController
      .create('mobile')
      .addElement(this.cartButtonMobile.nativeElement)
      .duration(600)
      .keyframes(keyframes);
    cartAnimationMobile.play();
  }

  async openCart() {
    const modal = await this.modalController.create({
      component: CartModalPage,
      cssClass: 'custom-modal'
    });

    await modal.present();
  }
}
