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

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  adminAddProductImage = '../../../assets/company/imgs/add-product.png';
  products: ProductDTO[] = [];
  firebaseProducts = [];
  isAdminLoggedIn: boolean;

  constructor(private route: ActivatedRoute,
              private cartService: CartService,
              private authenticationService: AuthenticationService,
              private productsService: ProductService,
              private modalController: ModalController) { }

  ngOnInit() {
    // this.route.queryParams.subscribe((params) => {
    //   this.filterProducts(params.category);
    // });
    this.subscribeToLoginStatus();
    this.subscribeToFirestoreProducts();
  }

  subscribeToLoginStatus() {
    this.authenticationService.getLoginStatus()
      .subscribe(authenticationStatus => this.isAdminLoggedIn = authenticationStatus);
  }

  subscribeToFirestoreProducts() {
    this.productsService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  // filterProducts(category = null) {
  //   if (!category) {
  //     this.products = productData;
  //   } else {
  //     const cat = categoryData.filter((item) => item.slug === category)[0];
  //     this.products = productData.filter((p) => p.category === cat.id);
  //   }
  // }

  addProduct(product) {
    this.cartService.addProduct(product);
  }

  // async openFilter() {
  //   const modal = await this.modalController.create({
  //     component: FilterModalPage,
  //     breakpoints: [0, 0.5],
  //     initialBreakpoint: 0.5,
  //     handle: false,
  //     componentProps: {
  //       categories: categoryData
  //     }
  //   });
  //
  //   await modal.present();
  //
  //   const { data } = await modal.onWillDismiss();
  //
  //   if (data) {
  //     this.filterProducts(data.category?.slug);
  //   }
  // }
}
