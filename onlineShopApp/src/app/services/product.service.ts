import {Injectable} from '@angular/core';
import {collectionData, deleteDoc, docData, doc, Firestore, collection, setDoc} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ProductDTO} from './model/product-dto';

const PRODUCTS_COLLECTION_KEY = 'products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) {
  }

  async addProduct(newProduct) {
    const productsReference = collection(this.firestore, PRODUCTS_COLLECTION_KEY);
    await setDoc(doc(productsReference), newProduct);
  }

  async deleteProduct(productId: string) {
    const productsReference = collection(this.firestore, PRODUCTS_COLLECTION_KEY);
    const documentReference = doc(this.firestore, PRODUCTS_COLLECTION_KEY, productId);
    await deleteDoc(documentReference);
  }

  getProducts(): Observable<ProductDTO[]> {
    const productsReference = collection(this.firestore, PRODUCTS_COLLECTION_KEY);
    return collectionData(productsReference, {idField: 'id'}) as Observable<ProductDTO[]>;
  }

  getProductById(id: string): Observable<ProductDTO> {
    const productDocumentReference = doc(this.firestore, PRODUCTS_COLLECTION_KEY, id);
    return docData(productDocumentReference, {idField: 'id'}) as Observable<ProductDTO>;
  }


}
