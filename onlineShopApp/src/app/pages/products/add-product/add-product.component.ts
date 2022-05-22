import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, Platform} from '@ionic/angular';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {DomSanitizer} from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryEnum} from '../../../services/model/category.enum';
import {ProductService} from '../../../services/product.service';




const FIRESTORE_BASE_PATH = '/images';
const DEFAULT_IMAGE_STORAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/shopapplicenta2022.appspot.com/o/images%2Fadd-image.jpg?alt=media&token=0d982f09-e1ea-4a90-b22a-ab551ac6339d';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('userImage', {static: false}) userImage: ElementRef;

  imageSource = null;
  defaultImageLocation = 'assets/company/imgs/add-image.jpg';

  newProductForm: FormGroup;
  imageToUploadUrl: string;
  currentImage: Photo = null;

  private imageSourceWasChanged = new BehaviorSubject<any>(null);

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer,
    private firestore: AngularFireDatabase,
    private firebaseStorage: AngularFireStorage,
    private productService: ProductService
  ) {
    this.subscribeToImageSourceChanged();
    this.initFormGroup();
  }

  ngOnInit() {
    this.imageSource = this.defaultImageLocation;
    this.imageToUploadUrl = DEFAULT_IMAGE_STORAGE_URL;
  }

  initFormGroup() {
    this.newProductForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required]],
    });
  }


  subscribeToImageSourceChanged() {
    this.imageSourceWasChanged.asObservable().subscribe((newUrl) => {
      this.imageSource = newUrl;
    });
  }

  save() {
    if (this.currentImage) {
      const file = this.convertBase64ToImageFile(this.currentImage.base64String,
        this.generateNameForStorageImage(), this.currentImage.format);

      this.uploadWithUserImage(file);
    } else {
      this.productService.addProduct(this.buildNewProduct());
    }
  }

  buildNewProduct() {
    return {
      title: this.newProductForm.get('title').value,
      description: this.newProductForm.get('description').value,
      category: this.newProductForm.get('category').value,
      price: this.newProductForm.get('price').value,
      imageUrl: this.imageToUploadUrl
    };
  }

  uploadWithUserImage(file: File) {
    const storageReference = this.firebaseStorage.ref(FIRESTORE_BASE_PATH);
    const uploadTask = this.firebaseStorage.upload(FIRESTORE_BASE_PATH + file.name, file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageReference.getDownloadURL().subscribe(downloadUrl => {
          this.imageToUploadUrl = downloadUrl;
          const newProduct = this.buildNewProduct();
          console.log(newProduct);
          this.productService.addProduct(newProduct);
        });
      })
    ).subscribe();
  }

  generateNameForStorageImage() {
    return new Date().getTime().toString();
  }

  async selectImageSource() {
    const sheetButtons = [
      {
        text: 'Take photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose from photos',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    if (!this.platform.is('hybrid')) {
      sheetButtons.push({
        text: 'Choose a file',
        icon: 'attach',
        handler: () => {
          // this.fileInput.nativeElement.click();
          this.changeImage();
        }
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Select image source',
      buttons: sheetButtons
    });
    await actionSheet.present();
  }

  uploadFile($event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const file: File = target.files[0];
    console.log(file);
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    if (image) {
      this.imageSourceWasChanged.next(this.b64toSrcFormat(image.base64String, image.format));
      this.currentImage = image;
    }
  }

  getCategoriesArray() {
    return Object.values(CategoryEnum);
  }

  private addImage(cameraSource: CameraSource) {

  }

  private b64toSrcFormat(b64Data: string, format: string) {
    const IMAGE_BASE64_PREFIX = 'data:image/' + format + ';base64,';
    return this.sanitizer.bypassSecurityTrustResourceUrl(IMAGE_BASE64_PREFIX + b64Data);
  }

  // https://stackoverflow.com/questions/58502673/angular-8-parsing-base64-to-file
  private dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    console.log(byteString);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], {type: 'image/png'});
    return blob;
  }

  private convertBase64ToImageFile(base64: string, imageName: string, imageType: string): File {
    const blob = this.dataURItoBlob(base64);
    return new File([blob], imageName, {type: 'image/' + imageType});
  }

}
