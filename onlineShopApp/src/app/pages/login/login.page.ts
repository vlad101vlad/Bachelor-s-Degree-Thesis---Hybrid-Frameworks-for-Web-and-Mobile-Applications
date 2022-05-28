import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;

  email: string;
  password: string;

  constructor(
    private autheticationService: AuthenticationService,
    private loadingController: LoadingController,
  ) {
  }

  ngOnInit() {
  }


  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.autheticationService.loginAdmin({email: this.email, password: this.password})
      .then((userResponse) => {
        this.autheticationService.showAlert('Login success!', '\n You are now logged in!');
      })
      .catch((error) => {
        console.log(error);
        this.autheticationService.showAlert('Login failed!', error.message + '\n Please try again!');
      });

    await loading.dismiss();
  }
}

