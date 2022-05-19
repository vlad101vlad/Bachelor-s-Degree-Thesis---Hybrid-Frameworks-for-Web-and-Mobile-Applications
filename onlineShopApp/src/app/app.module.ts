import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {provideDatabase, getDatabase} from '@angular/fire/database';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';
import {provideRemoteConfig, getRemoteConfig} from '@angular/fire/remote-config';
import {provideStorage, getStorage} from '@angular/fire/storage';
import {FIREBASE_OPTIONS} from "@angular/fire/compat";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()), provideRemoteConfig(() => getRemoteConfig()), provideStorage(() => getStorage())],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, {provide: FIREBASE_OPTIONS, useValue: environment.firebase}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
