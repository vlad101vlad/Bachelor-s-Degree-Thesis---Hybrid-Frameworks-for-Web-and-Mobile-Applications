import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, AnimationController, NavController, ToastController} from '@ionic/angular';

const DEFAULT_ADDRESS = 'Add an Address';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})


export class CheckoutPage implements OnInit {
  @ViewChild('orderbar', {read: ElementRef}) orderBar: ElementRef;
  @ViewChild('successbar', {read: ElementRef}) successBar: ElementRef;
  @ViewChild('delivery', {read: ElementRef}) deliveryCheckbox: ElementRef;

  total = 0;
  progress = 0;

  deliveryAddress = 'Add an Address';
  isPaymentSelected = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController,
    private navigationController: NavController,
    private toastController: ToastController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.total = this.router.getCurrentNavigation().extras.state.sum;
      }
    });
  }

  ngOnInit() {
  }

  startOrder() {
    const barMove = this.animationController
      .create('move')
      .addElement(this.orderBar.nativeElement)
      .fromTo('opacity', 1, 0)
      .fromTo('left', '0', '-100vw');

    const success = this.animationController
      .create('success')
      .addElement(this.successBar.nativeElement)
      .fromTo('left', '*', 0)
      .afterClearStyles(['success-bar']);

    const wrapper = this.animationController
      .create('wrapper')
      .duration(400)
      .easing('ease-in')
      .addAnimation([barMove, success])
      .play();

    wrapper.then(() => {
      this.fakeProgress();
    });
  }

  async requestGeolocationPermission() {
    await this.enterAddressAlert();
  }

  async close() {
    const toast = await this.toastController.create({
      message: 'Your order was submitted to the restaurant!',
      duration: 3000,
    });
    await toast.present();
    this.navigationController.setDirection('root');
    this.router.navigateByUrl('');
  }

  async enterAddressAlert() {
    const alert = await this.alertController.create({
      header: 'Please enter the delivery address:',
      inputs: [
        {
          name: 'City',
          type: 'text',
          placeholder: 'City'
        },
        {
          name: 'Street',
          type: 'text',
          placeholder: 'Street'
        },
        {
          name: 'Building',
          type: 'text',
          placeholder: 'Building no., floor, ap.'
        }
      ],
      buttons: [
        {
          text: 'Save',
          handler: (response) => {
            this.deliveryAddress = response.City + ', ' + response.Street + ', ' + response.Building;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });
    await alert.present();
    console.log(alert.inputs);
  }

  paymentMethodChanged(event: any) {
    const isChecked = event.target.checked;
    this.isPaymentSelected = !!isChecked;
  }

  canUserPay() {
    return this.deliveryAddress !== DEFAULT_ADDRESS && this.isPaymentSelected;
  }

  private fakeProgress() {
    if (this.progress >= 1) {
      this.close();
      return;
    }
    setTimeout(() => {
      this.progress += 0.01;
      this.fakeProgress();
    }, 20);

  }
}
