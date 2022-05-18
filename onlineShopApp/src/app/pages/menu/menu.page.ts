import {Component, OnInit} from '@angular/core';
import { isPlatform } from '@ionic/angular';
import categoryData from '../../../assets/company/categories.json';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  menuItems = [
    {
      title: 'Home',
      icon: 'home',
      path: '/',
    },
    {
      title: 'Products',
      icon: 'list',
      path: '/products',
      children: categoryData,
    },
    {
      title: 'About',
      icon: 'information',
      path: '/about',
    },
  ];
  title = 'Home';

  constructor() {
  }

  ngOnInit() {
    const headerHeight = isPlatform('ios') ? 44 : 56;
    document.documentElement.style.setProperty(
      '--header-height',
      `${headerHeight}px`
    );
  }

  setTitle(title) {
    this.title = title;
  }
}
