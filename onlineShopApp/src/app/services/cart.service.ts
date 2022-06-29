import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProductDTO} from './model/product-dto';
import {Storage} from '@capacitor/storage';
import {CartDto} from './model/cart-dto';
import {CartProductDto} from './model/cart-product-dto';
import {ToastController} from '@ionic/angular';

const CART_KEY = 'active-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemCount = new BehaviorSubject(0);
  private cartNeedsRefresh = new BehaviorSubject<boolean>(null);

  constructor(private toastController: ToastController) {
    const cartDto: CartDto = {
      products: [],
      raiderTip: '0'
    };

    Storage.keys().then((response) => {
      const keys = response.keys;
      if (!keys.find(iteratedKey => iteratedKey === CART_KEY)) {
        // Creating the storage key for the cart if not already created
        Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
      } else {
        // Setting the number of items already stored
        Storage.get({key: CART_KEY}).then((cartResponse) => {
            const cart = CartService.mapCartDtoStringyfiedToCartDTO(cartResponse.value);
            this.cartItemCount.next(this.computeCartNumberOfItems(cart.products));
          }
        );
      }
    });
  }

  // JSON mappings
  static mapCartDtoStringyfiedToCartDTO(cartDtoStringyfied): CartDto {
    return JSON.parse(cartDtoStringyfied);
  }

  private static mapProductNewToCartProduct(product: ProductDTO): CartProductDto {
    return {
      id: product.id,
      price: JSON.stringify(product.price),
      title: product.title,
      amount: '1'
    };
  }

  //CRUD operations
  addProduct(product: ProductDTO): Promise<any> {
    return Storage.get({key: CART_KEY}).then((response) => {
      const cartDto = CartService.mapCartDtoStringyfiedToCartDTO(response.value);

      if (cartDto.products.length > 0) {
        const existingProduct = this.findProductAlreadyInCart(cartDto.products, product);
        if (existingProduct) {
          const newAmount = Number(existingProduct.amount) + 1;
          existingProduct.amount = newAmount.toString();

          return Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
        }
      }

      cartDto.products.push(CartService.mapProductNewToCartProduct(product));
      this.cartItemCount.next(this.computeCartNumberOfItems(cartDto.products));
      return Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
    });
  }

  updateTip(tipAmount: number): Promise<any> {
    return Storage.get({key: CART_KEY}).then((response) => {
      const cartDto = CartService.mapCartDtoStringyfiedToCartDTO(response.value);

      const newTip = Number(cartDto.raiderTip) + tipAmount;
      if (newTip >= 0) {
        cartDto.raiderTip = newTip.toString();
      }
      return Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
    });
  }

  removeProduct(toRemoveProduct: ProductDTO): Promise<any> {
    return Storage.get({key: CART_KEY}).then((response) => {
      const cartDto = CartService.mapCartDtoStringyfiedToCartDTO(response.value);

      cartDto.products = cartDto.products
        .filter((cartProduct) => toRemoveProduct.id !== cartProduct.id);
      this.cartItemCount.next(this.computeCartNumberOfItems(cartDto.products));
      return Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
    });
  }

  getCart(): Promise<any> {
    return Storage.get({key: CART_KEY});
  }

  // Observable controls
  getCartCount() {
    return this.cartItemCount.asObservable();
  }

  getCartRefresh(): Observable<boolean> {
    return this.cartNeedsRefresh.asObservable();
  }

  notifyCartNeedsRefresh() {
    this.cartNeedsRefresh.next(true);
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  // Util functions for CRUD operations mappings
  private findProductAlreadyInCart(products: CartProductDto[], product: ProductDTO): CartProductDto {
    return products.find(iteratedProduct => iteratedProduct.id === product.id);
  }

  private computeCartNumberOfItems(products: CartProductDto[]): number {
    let sum = 0;
    products.forEach(product => sum += Number(product.amount));

    return sum;
  }
}
