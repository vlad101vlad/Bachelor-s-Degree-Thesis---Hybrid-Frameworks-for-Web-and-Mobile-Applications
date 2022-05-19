import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  title: string;
  description: string;
  category: string;
  price: number;

  constructor() { }

  ngOnInit() {}

  save() {

  }
}
