import { Injectable } from '@angular/core';
import { track, Identify, identify, init } from '@amplitude/analytics-browser';
import { DeviceService } from './device.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AmplitudeService {
  private _storage: Storage | null = null;

  constructor(private deviceService: DeviceService, private storage: Storage) {
    init('6d056dc00128c65c218840b7782bccda', undefined, {
      defaultTracking: {
        sessions: true,
        pageViews: true,
        formInteractions: true,
        fileDownloads: true,
      },
    });

    this.storage.create().then((storage) => {
      this._storage = storage;
      this._storage.get('installTime').then((installTime) => {
        if (installTime === null) {
          this._storage?.set('installTime', new Date().getTime());
          this.track('install', { installTime: new Date().getTime() });
        }
      });
    });
  }

  public identify() {
    if (!this.deviceService.isLoaded) {
      setTimeout(() => {
        this.identify();
      }, 100);
      return;
    }
    const event = new Identify();
    event.set('device', this.deviceService.model);
    event.set('platform', this.deviceService.platform);
    event.set('os', this.deviceService.operatingSystem);
    event.set('osVersion', this.deviceService.version);
    event.set('manufacturer', this.deviceService.manufacturer);
    event.set('isVirtual', this.deviceService.isVirtual);
    event.set('deviceId', this.deviceService.id);
    event.set('appVersion', '1');
    identify(event);
  }

  public track(event: string, properties?: any) {
    if (!this.deviceService.isLoaded) {
      setTimeout(() => {
        this.track(event, properties);
      }, 100);
      return;
    }
    track(event, properties);
  }

  public checkFirstStart() {}
}
