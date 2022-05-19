import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import {AuthenticationService} from '../../services/authentication.service';
import {ProductService} from '../../services/product.service';
import {ProductDTO} from '../../services/model/product-dto';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  product: ProductDTO = null;
  category = null;
  isAdminLoggedIn: boolean;
  isProductInformationLoaded: boolean;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private authenticationService: AuthenticationService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.subscribeToProductDocument();
    this.subscribeToLoginStatus();
  }

  subscribeToLoginStatus() {
    this.authenticationService.getLoginStatus()
      .subscribe(authenticationStatus => this.isAdminLoggedIn = authenticationStatus);
  }

  subscribeToProductDocument() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id).subscribe(productResponse => {
      this.product = productResponse;
      console.log('API CALL: Product data loaded', this.product);

      this.isProductInformationLoaded = true;
    });
  }

  // loadDummyData() {
  //   const id = this.route.snapshot.paramMap.get('id');
  //
  //   this.product = productData.filter((p) => p.id === id)[0];
  //   this.category = categoryData.filter(
  //     (c) => c.id === this.product.category
  //   )[0];
  // }

  addToCart() {
    this.cartService.addProduct(this.product);
  }

  edit() {

  }

  delete() {

  }

  editImage() {

  }
}
