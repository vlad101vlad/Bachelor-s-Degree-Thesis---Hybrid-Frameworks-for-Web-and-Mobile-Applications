import { Component, OnInit } from '@angular/core';
import productData from '../../../assets/company/menu.json';
import categoryData from '../../../assets/company/categories.json';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {ModalController} from '@ionic/angular';
import {FilterModalPage} from '../filter-modal/filter-modal.page';
import {AuthenticationService} from '../../services/authentication.service';
import {ProductService} from '../../services/product.service';
import {ProductDTO} from '../../services/model/product-dto';
import {CategoryEnum} from '../../services/model/category.enum';

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
              private modalController: ModalController) { }

  ngOnInit() {
    this.subscribeToLoginStatus();
    this.subscribeToFirestoreProducts();

    this.route.queryParams.subscribe((params) => {
      this.filterProducts(params.category);
    });
  }

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

  filterProducts(category = null) {
    if (category) {
      this.displayProducts = this.products
        .filter((product) => this.categoryMapper(product.category) === category);
    } else {
      this.displayProducts = this.products;
    }
  }

  addProduct(product) {
    this.cartService.addProduct(product);
    this.cartService.addProductStorage(product);
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

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.filterProducts(this.categoryMapper(data.category));
    }
  }

  private categoryMapper(productCategory: string): string {
    productCategory.replace(/\s/g, '-');
    return productCategory.toLowerCase();
  }
}
