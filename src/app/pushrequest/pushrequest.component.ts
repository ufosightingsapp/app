import { Component, OnInit } from '@angular/core';
import { FcmService } from '../fcm.service';
import { Storage } from '@ionic/storage-angular';
import { Capacitor } from '@capacitor/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-pushrequest',
  templateUrl: './pushrequest.component.html',
  styleUrls: ['./pushrequest.component.scss'],
})
export class PushrequestComponent implements OnInit {
  isAlertOpen: boolean = false;
  _storage: Storage | null = null;
  roleMessage = '';

  constructor(
    private fcm: FcmService,
    private storage: Storage,
    public translocoService: TranslocoService
  ) {
    this.storage.create().then((storage) => {
      this._storage = storage;
    });
  }

  ngOnInit() {
    if (Capacitor.getPlatform() == 'web') return;
    setTimeout(() => {
      this.loadPushRequest();
    }, 25000);
  }

  async loadPushRequest() {
    if (this._storage == null) {
      setTimeout(() => this.loadPushRequest(), 100);
      return;
    }
    const canRequest = await this.fcm.canRequestPermission();
    if (canRequest) {
      let hasPermission = await this.fcm.hasPermissions();
      if (!hasPermission) {
        this.isAlertOpen = true;
      }
    }
  }

  public alertButtons = [
    {
      text: this.translocoService.translate('common.no'),
      role: 'cancel',
      handler: () => {},
    },
    {
      text: this.translocoService.translate('common.yes'),
      role: 'confirm',
      handler: async () => {
        await this.fcm.registerNotifications();
      },
    },
  ];

  setResult(ev: any) {
    switch (ev.detail.role) {
      case 'cancel':
        break;
      case 'confirm':
        break;
    }
  }
}
