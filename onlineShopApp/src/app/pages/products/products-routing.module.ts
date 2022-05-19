import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsPage } from './products.page';
import {AddProductComponent} from './add-product/add-product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
    pathMatch: 'full'
  },
  {
    path: 'add-product',
    component: AddProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
