import { Injectable } from '@angular/core';
import { RateApp } from 'capacitor-rate-app';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private _storage: Storage | null = null;
  private initialized: boolean = false;

  constructor(private storage: Storage) {}

  public async initialize() {
    this.storage.create().then((storage) => {
      this._storage = storage;
      this.initialized = true;
      this.increaseOpeningCount();
    });
  }

  public increaseOpeningCount() {
    if (!this.initialized) {
      setTimeout(() => this.increaseOpeningCount(), 100);
      return;
    }
    this._storage?.get('openingCount').then((openingCount) => {
      if (openingCount == null) openingCount = 0;
      openingCount = parseInt(openingCount, 10) + 1;
      this._storage?.set('openingCount', openingCount);
      if (openingCount >= 3) {
        RateApp.requestReview();
      }
    });
  }
}
