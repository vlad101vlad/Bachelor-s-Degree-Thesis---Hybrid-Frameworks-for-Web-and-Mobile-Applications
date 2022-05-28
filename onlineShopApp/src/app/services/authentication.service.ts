import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  Auth,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import {setPersistence} from '@firebase/auth';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  userData: any;

  constructor(
    private firebaseAuth: Auth,
    private alertController: AlertController,
  ) {
    this.subscribeToAuthenticationListener();
  }

  subscribeToAuthenticationListener() {
    this.firebaseAuth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
      }
    });
  }

  setLocalAuthenticationPersistance(): Promise<any> {
    return setPersistence(this.firebaseAuth, browserLocalPersistence);
  }

  async loginAdmin({email, password}): Promise<any> {
    return this.setLocalAuthenticationPersistance().then(_ => signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ));
  }

  logout() {
    this.isAuthenticated.next(false);
  }

  logoutAdmin(): Promise<void> {
    return signOut(this.firebaseAuth);
  }

  getLoginStatus(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
