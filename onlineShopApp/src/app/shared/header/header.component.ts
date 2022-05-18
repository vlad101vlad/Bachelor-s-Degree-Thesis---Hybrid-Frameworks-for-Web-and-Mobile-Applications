import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import categoriesData from '../../../assets/company/categories.json';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('productButton', {read: ElementRef}) productButton: ElementRef;
  @Input() title: string;
  dropdown: boolean;
  categories = categoriesData;

  constructor() { }

  ngOnInit() {}

  hideDropdown(event) {
    const xTouch = event.clientX;
    const yTouch = event.clientY;
    const rect = this.productButton.nativeElement.getBoundingClientRect();
    const topBoundary = rect.top+2;
    const leftBoundary = rect.left+2;
    const rightBoundary = rect.right-2;
    if (xTouch < leftBoundary || xTouch > rightBoundary || yTouch < topBoundary) {
      this.dropdown = false;
    }

  }

}
