import {CartProductDto} from './cart-product-dto';

export interface CartDto {
  products: CartProductDto[];
  raiderTip: string;
}
