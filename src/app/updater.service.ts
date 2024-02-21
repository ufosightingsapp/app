import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { App } from '@capacitor/app';
import { ModalController, Platform } from '@ionic/angular';
import { UpdatePopupComponent } from './update-popup/update-popup.component';

@Injectable({
  providedIn: 'root',
})
export class UpdaterService {
  STORE_URL: string =
    'https://play.google.com/store/apps/details?id=app.ufosightings.www';

  constructor(
    private backend: BackendService,
    private platform: Platform,
    private modalCtrl: ModalController
  ) {}

  hasAvailable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('capacitor')) {
        this.backend.getJSON('/updater/version').subscribe(
          (data: any) => {
            App.getInfo().then((info) => {
              // info.version is the version of the app running
              // Request the server for the latest version
              if (parseInt(data.version) > parseInt(info.version)) {
                this.STORE_URL = data.url;
                resolve(true);
                return;
              }
              resolve(false);
            });
          },
          (error: any) => {
            resolve(false);
          }
        );
      } else {
        resolve(false);
      }
    });
  }

  promptUpdate() {
    this.modalCtrl
      .create({
        component: UpdatePopupComponent,
        cssClass: 'update-modal',
      })
      .then((modal) => {
        modal.present();
      });
  }
}
