import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActionSheetController, Platform} from '@ionic/angular';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {Firestore} from '@angular/fire/firestore';
import {Storage} from '@angular/fire/storage';
import {DomSanitizer} from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs';


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

  title: string;
  description: string;
  category: string;
  price: number;

  private imageSourceWasChanged = new BehaviorSubject<any>(null);

  constructor(
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer,
    private firestore: Firestore,
    private firebaseStorage: Storage
  ) {
    this.subscribeToImageSourceChanged();
  }

  ngOnInit() {
    this.imageSource = this.defaultImageLocation;
  }

  subscribeToImageSourceChanged() {
    this.imageSourceWasChanged.asObservable().subscribe((newUrl) => {
      this.imageSource = newUrl;
    });
  }

  save() {

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
    debugger;
    if(image) {
      this.imageSourceWasChanged.next(this.b64toSrcFormat(image.base64String, image.format));
    }
  }

  private addImage(cameraSource: CameraSource) {

  }

  private showImage(file: File) {
    const formData = new FormData();
    formData.append('file', file.name);
    formData.append('name', file.name);

  }

  private b64toSrcFormat(b64Data: string, format: string) {
    const IMAGE_BASE64_PREFIX = 'data:image/' + format + ';base64,';
    return this.sanitizer.bypassSecurityTrustResourceUrl(IMAGE_BASE64_PREFIX + b64Data);
  }

}
