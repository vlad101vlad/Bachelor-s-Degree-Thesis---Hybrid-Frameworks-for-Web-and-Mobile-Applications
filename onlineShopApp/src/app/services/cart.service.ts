import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProductModel} from '../shared/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = {};
  private cartItemCount = new BehaviorSubject(0);

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

    this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  removeProduct(item: any) {
    delete this.cart[item.id];

    this.cartItemCount.next(this.cartItemCount.value - item.amount);
    item.amount = 0;
  }

  getCartCount() {
    return this.cartItemCount.asObservable();
  }

  getCart() {
    const cartItems = [];
    for( const [key, value] of Object.entries(this.cart)) {
      cartItems.push(value);
    }

    return cartItems;
  }
}
