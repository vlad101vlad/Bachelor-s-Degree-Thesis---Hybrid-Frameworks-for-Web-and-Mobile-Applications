import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {AuthenticationService} from '../../services/authentication.service';
import {ProductService} from '../../services/product.service';
import {ProductDTO} from '../../services/model/product-dto';
import {CategoryEnum} from '../../services/model/category.enum';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  product: ProductDTO = null;
  isAdminLoggedIn: boolean;
  isProductInformationLoaded: boolean;
  isEditModeOn = false;
  toUpdate = {};

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private authenticationService: AuthenticationService,
    private productService: ProductService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.subscribeToProductDocument();
    this.subscribeToLoginStatus();
    console.log(Object.values(CategoryEnum));
  }

  subscribeToLoginStatus() {
    this.authenticationService.getLoginStatus()
      .subscribe(authenticationStatus => this.isAdminLoggedIn = authenticationStatus);
  }

  subscribeToProductDocument() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(id).subscribe(productResponse => {
      this.product = productResponse;

      console.log('API CALL: Product data loaded');

      this.isProductInformationLoaded = true;
    });
  }

  addToCart() {
    this.cartService.addProduct(this.product).then((addedProduct) => {
      this.cartService.showToast('Product was added to the cart');
      this.cartService.notifyCartNeedsRefresh();
    });
  }

  edit() {
    this.isEditModeOn = true;
  }

  async delete() {
    await this.productService.deleteProduct(this.product.id);
    this.router.navigateByUrl('/products', {replaceUrl: true});
  }

  async save() {
    if (this.toUpdate !== {}) {
      await this.productService.editProduct(this.toUpdate, this.product.id);
      this.toUpdate = {};
      this.isEditModeOn = false;
    }
  }

  tryUpdate(key, newValue, oldValue) {
    if (this.checkIfNeedsUpdate(newValue, oldValue)) {
      this.addElementToUpdate(key, newValue);
    }
  }

  checkIfNeedsUpdate(oldValue, newValue) {
    return oldValue !== newValue;
  }

  addElementToUpdate(key, value) {
    this.toUpdate[key] = value;
  }
}
