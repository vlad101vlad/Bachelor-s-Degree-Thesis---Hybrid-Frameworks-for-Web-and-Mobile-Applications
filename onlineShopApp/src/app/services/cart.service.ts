import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProductModel} from '../shared/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = {};
  private cartItems = new BehaviorSubject(0);

  constructor() { }

  addProduct(product: ProductModel) {
    if(!this.cart[product.id]) {
      this.cart[product.id] = {
        amount: 1,
        ...product,
      };
    } else  {
      this.cart[product.id].amount += 1;
    }

    this.cartItems.next(this.cartItems.value + 1);
  }

  getCartCount() {
    return this.cartItems.asObservable();
  }

  getCart() {
    const cartItems = [];
    for( const [key, value] of Object.entries(this.cart)) {
      cartItems.push(value);
    }

    return cartItems;
  }
}
