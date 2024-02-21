import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MarkerHolderService {
  marker: any = {};
  constructor() {}

  add(markerId: any, spotId: any) {
    for (let markerId in this.marker) {
      if (this.marker[markerId] == spotId) {
        return;
      }
    }
    this.marker[markerId] = spotId;
  }

  get(markerId: any) {
    return this.marker[markerId];
  }

  getAllMarkerIds() {
    return Object.keys(this.marker);
  }

  getAllSpotIds() {
    return Object.values(this.marker);
  }

  getFromSpotId(spotId: any) {
    if (Object.keys(this.marker).length == 0) return null;
    for (let markerId in this.marker) {
      if (this.marker[markerId] == spotId) {
        return markerId;
      }
    }
    return null;
  }

  deleteOne(markerId: any) {
    delete this.marker[markerId];
  }

  clear() {
    this.marker = {};
  }
}
