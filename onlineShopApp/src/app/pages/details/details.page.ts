import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import productData from '../../../assets/company/menu.json';
import categoryData from '../../../assets/company/categories.json';
import { CartService } from '../../services/cart.service';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  product = null;
  category = null;
  isAdminLoggedIn: boolean;


  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loadDummyData();
    this.subscribeToLoginStatus();
  }

  subscribeToLoginStatus() {
    this.authenticationService.getLoginStatus()
      .subscribe(authenticationStatus => this.isAdminLoggedIn = authenticationStatus);
  }

  loadDummyData() {
    const id = this.route.snapshot.paramMap.get('id');

    this.product = productData.filter((p) => p.id === id)[0];
    this.category = categoryData.filter(
      (c) => c.id === this.product.category
    )[0];
  }

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
