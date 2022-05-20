import {Component, OnInit} from '@angular/core';
import categoryData from '../../../assets/company/categories.json';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {ModalController} from '@ionic/angular';
import {FilterModalPage} from '../filter-modal/filter-modal.page';
import {AuthenticationService} from '../../services/authentication.service';
import {ProductService} from '../../services/product.service';
import {ProductDTO} from '../../services/model/product-dto';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  adminAddProductImage = '../../../assets/company/imgs/add-product.png';
  products: ProductDTO[] = [];
  displayProducts: ProductDTO[] = [];
  isAdminLoggedIn: boolean;

  constructor(private route: ActivatedRoute,
              private cartService: CartService,
              private authenticationService: AuthenticationService,
              private productsService: ProductService,
              private modalController: ModalController) {
  }

  private static categoryMapper(productCategory: string): string {
    productCategory.replace(/\s/g, '-');
    return productCategory.toLowerCase();
  }

  ngOnInit() {
    this.subscribeToLoginStatus();
    this.subscribeToFirestoreProducts();

    this.route.queryParams.subscribe((params) => {
      this.filterProducts(params.category);
    });
  }

  // Observable subscriptions
  subscribeToLoginStatus() {
    this.authenticationService.getLoginStatus()
      .subscribe(authenticationStatus => this.isAdminLoggedIn = authenticationStatus);
  }

  subscribeToFirestoreProducts() {
    this.productsService.getProducts().subscribe(products => {
      this.products = products;
      this.displayProducts = this.products;
    });
  }

  // CRUD Operations
  addProduct(product) {
    this.cartService.addProduct(product).then((addedProduct) => {
      this.cartService.showToast('Product was added to the cart');
      this.cartService.notifyCartNeedsRefresh();
    });
  }

  // Filtering
  filterProducts(category = null) {
    if (category) {
      this.displayProducts = this.products
        .filter((product) => ProductsPage.categoryMapper(product.category) === category);
    } else {
      this.displayProducts = this.products;
    }
  }

  async openFilter() {
    const modal = await this.modalController.create({
      component: FilterModalPage,
      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5,
      handle: false,
      componentProps: {
        categories: categoryData
      }
    });

    await modal.present();

    const {data} = await modal.onWillDismiss();

    if (data) {
      this.filterProducts(ProductsPage.categoryMapper(data.category));
    }
  }
}
