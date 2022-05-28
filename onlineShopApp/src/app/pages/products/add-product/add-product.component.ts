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
import {Router} from '@angular/router';
import {SharedService} from '../../../services/shared.service';


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

  templateImageSource = null;
  defaultImageLocalLocation = 'assets/company/imgs/add-image.jpg';

  newProductForm: FormGroup;
  imageToUploadUrl: string;
  currentImageToBeUploaded: Photo = null;

  private imageSourceWasChanged = new BehaviorSubject<any>(null);

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer,
    private firestore: AngularFireDatabase,
    private firebaseStorage: AngularFireStorage,
    private productService: ProductService,
    private router: Router
  ) {
    this.subscribeToImageSourceChanged();
    this.initFormGroup();
  }

  // Util functions for image processing and converting
  // https://stackoverflow.com/questions/58502673/angular-8-parsing-base64-to-file
  private static dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], {type: 'image/png'});
    return blob;
  }

  private static convertBase64ToImageFile(base64: string, imageName: string, imageType: string): File {
    const blob = AddProductComponent.dataURItoBlob(base64);
    return new File([blob], imageName, {type: 'image/' + imageType});
  }

  async changeImage(cameraSource: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: cameraSource
    });
    if (image) {
      this.imageSourceWasChanged.next(this.b64toSrcFormat(image.base64String, image.format));
      this.currentImageToBeUploaded = image;
    }
  }

  ngOnInit() {
    this.templateImageSource = this.defaultImageLocalLocation;
    this.imageToUploadUrl = DEFAULT_IMAGE_STORAGE_URL;
  }

  // Init functions
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
      this.templateImageSource = newUrl;
    });
  }

  // CRUD operations
  save() {
    if (this.currentImageToBeUploaded) {
      const file = AddProductComponent.convertBase64ToImageFile(this.currentImageToBeUploaded.base64String,
        this.generateNameForStorageImage(), this.currentImageToBeUploaded.format);

      this.uploadWithUserImage(file);
    } else {
      this.productService.addProduct(this.buildNewProduct());
      this.router.navigateByUrl('/products', {replaceUrl: true});
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
    const filePath = FIRESTORE_BASE_PATH + '/' + file.name;
    const storageReference = this.firebaseStorage.ref(filePath);
    const uploadTask = this.firebaseStorage.upload(filePath, file);

    this.sharedService.uploadProgress$ = uploadTask.percentageChanges();

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageReference.getDownloadURL().subscribe(downloadUrl => {
          this.imageToUploadUrl = downloadUrl;
          const newProduct = this.buildNewProduct();
          this.productService.addProduct(newProduct);
          this.router.navigateByUrl('/products', {replaceUrl: true});
        });
      })
    ).subscribe();
  }

  generateNameForStorageImage() {
    return new Date().getTime().toString();
  }

  async selectImageSource() {
    const sheetButtons = this.getSheetButtons();

    if (!this.platform.is('hybrid')) {
      sheetButtons.push({
        text: 'Choose a file',
        icon: 'attach',
        handler: () => {
          this.changeImage(CameraSource.Photos);
        }
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Select image source',
      buttons: sheetButtons
    });
    await actionSheet.present();
  }

  getCategoriesArray() {
    return Object.values(CategoryEnum);
  }

  // Util for image processing and converting
  private b64toSrcFormat(b64Data: string, format: string) {
    const IMAGE_BASE64_PREFIX = 'data:image/' + format + ';base64,';
    return this.sanitizer.bypassSecurityTrustResourceUrl(IMAGE_BASE64_PREFIX + b64Data);
  }

  private getSheetButtons() {
    return [
      {
        text: 'Take photo',
        icon: 'camera',
        handler: () => {
          this.changeImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose from photos',
        icon: 'image',
        handler: () => {
          this.changeImage(CameraSource.Photos);
        }
      }
    ];
  }
}
