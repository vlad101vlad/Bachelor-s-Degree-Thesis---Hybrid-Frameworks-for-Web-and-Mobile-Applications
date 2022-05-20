import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProductDTO} from './model/product-dto';
import {Storage} from '@capacitor/storage';
import {CartDto} from './model/cart-dto';
import {CartProductDto} from './model/cart-product-dto';

const CART_KEY = 'active-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = {};
  private cartItemCount = new BehaviorSubject(0);

  constructor() {
    const cartDto: CartDto = {
      products: [],
      raiderTip: '0'
    };

    Storage.keys().then((response) => {
      const keys = response.keys;
      if (!keys.find(iteratedKey => iteratedKey === CART_KEY)) {
        Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
      } else {
        Storage.get({key: CART_KEY}).then((cartResponse) => {
            const cart = this.mapCartDtoStringyfiedToCartDTO(cartResponse.value);
            this.cartItemCount.next(this.computeCartNumberOfItems(cart.products));
          }
        );
      }
    });
  }


  addProduct(product: ProductDTO) {
    if (!this.cart[product.id]) {
      this.cart[product.id] = {
        amount: 1,
        ...product,
      };
    } else {
      this.cart[product.id].amount += 1;
    }

    this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  addProductStorage(product: ProductDTO) {
    Storage.get({key: CART_KEY}).then((response) => {
        const cartDto = this.mapCartDtoStringyfiedToCartDTO(response.value);

        if (cartDto.products.length === 0) {
          cartDto.products.push(this.mapProductToCartProduct(product));
        } else {
          const existingProduct = this.findProductAlreadyInCart(cartDto.products, product);
          if (existingProduct) {
            const newAmount = Number(existingProduct.amount) + 1;
            existingProduct.amount = newAmount.toString();
          } else {
            cartDto.products.push(this.mapProductToCartProduct(product));
          }
        }

        Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
        // this.cartItemCount.next(cartDto.products.length);
      }
    );
  }

  removeProduct(item: any) {
    delete this.cart[item.id];

    this.cartItemCount.next(this.cartItemCount.value - item.amount);
    item.amount = 0;
  }

  removeProductFromStorage(product: ProductDTO) {
    Storage.get({key: CART_KEY}).then((response) => {
        const cartDto = this.mapCartDtoStringyfiedToCartDTO(response.value);

        if (cartDto.products.length === 0) {
          cartDto.products.push(this.mapProductToCartProduct(product));
        } else {
          const existingProduct = this.findProductAlreadyInCart(cartDto.products, product);
          if (existingProduct) {
            const newAmount = Number(existingProduct.amount) + 1;
            existingProduct.amount = newAmount.toString();
          } else {
            cartDto.products.push(this.mapProductToCartProduct(product));
          }
        }

        Storage.set({key: CART_KEY, value: JSON.stringify(cartDto)});
      }
    );
  }

  getCartCount() {
    return this.cartItemCount.asObservable();
  }

  getCart() {
    const cartItems = [];
    for (const [key, value] of Object.entries(this.cart)) {
      cartItems.push(value);
    }

    return cartItems;
  }

  async getCartFromStorage() {
    const {value} = await Storage.get({key: CART_KEY});

    return this.mapCartDtoStringyfiedToCartDTO(value);
  }

  private findProductAlreadyInCart(products: CartProductDto[], product: ProductDTO): CartProductDto {
    return products.find(iteratedProduct => iteratedProduct.id === product.id);
  }

  private mapProductToCartProduct(product: ProductDTO): CartProductDto {
    const cartProduct: CartProductDto = {
      id: product.id,
      price: JSON.stringify(product.price),
      title: product.title,
      amount: '1'
    };
    return cartProduct;
  }

  private mapCartDtoStringyfiedToCartDTO(cartDtoStringyfied): CartDto {
    console.log(cartDtoStringyfied);
    const cartDto: CartDto = JSON.parse(cartDtoStringyfied);
    return cartDto;
  }

  private computeCartNumberOfItems(products: CartProductDto[]): number {
    let sum = 0;
    products.forEach(product => sum += Number(product.amount));

    return sum;
  }
}
