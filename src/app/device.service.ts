import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  public isLoaded: boolean = false;
  public id: string = '';
  public model: string = '';
  public platform: string = '';
  public operatingSystem: string = '';
  public version: string = '';
  public manufacturer: string = '';
  public isVirtual: boolean = false;
  public language: string = '';

  constructor() {
    Device.getInfo().then((info) => {
      this.model = info.model;
      this.platform = info.platform;
      this.operatingSystem = info.operatingSystem;
      this.version = info.osVersion;
      this.manufacturer = info.manufacturer;
      this.isVirtual = info.isVirtual;
      Device.getId().then((id) => (this.id = id.identifier));
      this.isLoaded = true;
      Device.getLanguageCode().then((language) => {
        this.language = language.value;
      });
    });
  }
}
