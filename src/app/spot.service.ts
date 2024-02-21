import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class SpotService {
  private _storage: Storage | null = null;
  private initialized: boolean = false;

  public spots: any[] = [];
  public lastDownloadUnix: any = 0;
  public downloadInterval: any = null;

  public spotAdded: Subject<boolean> = new Subject<boolean>();
  public spotsChanged: Subject<boolean> = new Subject<boolean>();
  public spotsNavigate: Subject<string> = new Subject<string>();

  constructor(private storage: Storage, private backend: BackendService) {
    this.storage.create().then((storage: any) => {
      this._storage = storage;
      this.download().then(() => {
        this.initialized = true;
      });
      this.startInterval();
    });
  }

  async addSpot(spot: any) {
    this.spotAdded.next(spot);
  }

  async refresh() {
    this.spotsChanged.next(true);
    this._storage?.set('spots', []);
    this._storage?.set('spots:cache:time', 0);
    await this.download();
  }

  get() {
    return this.spots;
  }

  async download() {
    if (!this.initialized) {
      setTimeout(() => this.download(), 100);
      return;
    }

    this.spots = (await this._storage?.get('spots')) || [];
    this.lastDownloadUnix = (await this._storage?.get('spots:cache:time')) || 0;
    this.lastDownloadUnix = parseInt(this.lastDownloadUnix);

    return await new Promise((resolve) => {
      if (this.lastDownloadUnix == 0) {
        this.backend.getJSON('/spots/all').subscribe((data) => {
          this.spots = data;
          this._storage?.set('spots', data);
          this._storage?.set('spots:cache:time', new Date().getTime());
          this.spotsChanged.next(true);
          resolve(true);
        });
        return;
      }

      this.backend
        .getJSON('/spots/latest-received?limit=1&skip=0')
        .subscribe((data) => {
          if (
            data &&
            data[0] &&
            data[0].receivedAtUnix > this.lastDownloadUnix
          ) {
            this.backend
              .getJSON(
                `/spots/fresh?from=${new Date(
                  this.lastDownloadUnix
                ).toISOString()}&to=${new Date().toISOString()}`
              )
              .subscribe((data) => {
                this.spots = this.spots.concat(data);
                this._storage?.set('spots', this.spots);
                this._storage?.set('spots:cache:time', new Date().getTime());
                //this.spotsChanged.next(true);
                data.forEach((spot: any) => {
                  this.spotAdded.next(spot);
                });
                resolve(true);
              });
          } else {
            resolve(false);
          }
        });
    });
  }

  navigate(spotId: string) {
    this.spotsNavigate.next(spotId);
  }

  startInterval() {
    if (!this.initialized) {
      setTimeout(() => this.startInterval(), 100);
      return;
    }

    this.downloadInterval = setInterval(() => {
      this.download();
    }, 1000 * 15);
  }
}
