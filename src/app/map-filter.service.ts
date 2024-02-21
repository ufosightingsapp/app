import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class MapFilterService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  initStorage() {
    this.storage.create().then((storage) => {
      this._storage = storage;
    });
  }

  setTime(from: any, to: any) {
    this._storage?.set('filter:time:from', from);
    this._storage?.set('filter:time:to', to);
    this._storage?.set('filter:time:string', null);
  }

  async getTime() {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.initStorage();
        setTimeout(() => {
          this.getTime().then(resolve);
        }, 100);
      });
    }
    let from = await this._storage?.get('filter:time:from');
    let to = await this._storage?.get('filter:time:to');
    return { from, to };
  }

  setTimeString(time: string) {
    this._storage?.set('filter:time:from', null);
    this._storage?.set('filter:time:to', null);
    this._storage?.set('filter:time:string', time);
  }

  async getTimeString() {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.initStorage();
        setTimeout(() => {
          this.getTimeString().then(resolve);
        }, 100);
      });
    }
    return await this._storage?.get('filter:time:string');
  }

  clear() {
    this._storage?.set('filter:time:from', null);
    this._storage?.set('filter:time:to', null);
    this._storage?.set('filter:time:string', null);
  }

  async filterSpots(spots: any) {
    let timeFilter: any = await this.getTime();
    let timeFilterString: string = await this.getTimeString();
    if (
      timeFilter.from == null &&
      timeFilter.to == null &&
      timeFilterString == null
    ) {
      return spots;
    }

    let filterUnixFrom = 0;
    let filterUnixTo = 0;
    if (timeFilterString != null) {
      if (timeFilterString == 'today') {
        filterUnixFrom = new Date().setHours(0, 0, 0, 0);
        filterUnixTo = new Date().setHours(23, 59, 59, 999);
      }

      if (timeFilterString == 'week') {
        filterUnixFrom = new Date().setDate(new Date().getDate() - 7);
        filterUnixTo = new Date().getTime();
      }

      if (timeFilterString == 'month') {
        filterUnixFrom = new Date().setDate(new Date().getDate() - 30);
        filterUnixTo = new Date().getTime();
      }

      if (timeFilterString == 'halfyear') {
        filterUnixFrom = new Date().setDate(new Date().getDate() - 183);
        filterUnixTo = new Date().getTime();
      }

      if (timeFilterString == 'year') {
        filterUnixFrom = new Date().setDate(new Date().getDate() - 365);
        filterUnixTo = new Date().getTime();
      }
    } else if (timeFilter.from != null && timeFilter.to != null) {
      filterUnixFrom = new Date(timeFilter.from).getTime();
      filterUnixTo = new Date(timeFilter.to).getTime();
    }

    return spots.filter((spot: any) => {
      if (spot.creationTimeUnix < filterUnixFrom) {
        return false;
      }
      if (spot.creationTimeUnix > filterUnixTo) {
        return false;
      }
      return true;
    });
  }
}
