import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Auth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private firebaseAuth: Auth
  ) { }

  login() {
    this.isAuthenticated.next(true);
  }

  logout() {
    this.isAuthenticated.next(false);
  }

  getLoginStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
