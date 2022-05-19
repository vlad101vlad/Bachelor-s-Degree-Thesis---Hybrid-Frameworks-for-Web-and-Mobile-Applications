import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false;
  email = '';
  password = '';

  constructor(private autheticationService: AuthenticationService) { }

  ngOnInit() {
  }

  loginAdmin() {
    this.autheticationService.login();
  }
}
