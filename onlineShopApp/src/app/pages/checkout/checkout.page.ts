import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AnimationController, NavController, ToastController} from '@ionic/angular';
import {Geolocation} from "@capacitor/geolocation";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  @ViewChild('orderbar', { read: ElementRef }) orderBar: ElementRef;
  @ViewChild('successbar', { read: ElementRef }) successBar: ElementRef;

  total = 0;
  progress = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animationController: AnimationController,
    private navigationController: NavController,
    private toastController: ToastController
  ) {
    this.route.queryParams.subscribe((params) => {
      if(this.router.getCurrentNavigation().extras.state) {
        this.total = this.router.getCurrentNavigation().extras.state.sum;
      }
    });
  }

  ngOnInit() {
  }

  startOrder() {
    const  barMove = this.animationController
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

  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
  }

  async requestGeolocationPermission() {
    try {
      const status = await Geolocation.requestPermissions();
      console.log(status);
      // eslint-disable-next-line eqeqeq
      if(status?.location == 'granted'){
        this.locate();
      } else {
        console.log('Location not permitted');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async close() {
    const toast = await this.toastController.create({
      message: 'Your order was submitted to the restaurant!',
      duration: 3000,
    });
    await toast.present();
    this.navigationController.setDirection('root');
    this.router.navigateByUrl('/home');
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
