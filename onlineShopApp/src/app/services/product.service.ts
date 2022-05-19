import { Injectable } from '@angular/core';
import {collection, collectionData, doc, docData, Firestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ProductDTO} from './model/product-dto';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) {
  }

  getProducts(): Observable<ProductDTO[]> {
    const productsReference = collection(this.firestore, 'products');
    return collectionData(productsReference, {idField: 'id'}) as Observable<ProductDTO[]>;
  }

  getProductById(id: string): Observable<ProductDTO> {
    const productDocumentReference = doc(this.firestore, 'products', id);
    return docData(productDocumentReference, {idField: 'id'}) as Observable<ProductDTO>;
  }

  // getCategoryEnumFromValue(categoryString: string): CategoryEnum {
  //   return categoryString as CategoryEnum;
  // }
}
