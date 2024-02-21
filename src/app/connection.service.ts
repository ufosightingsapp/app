import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  connected: any = true;

  constructor() {
    Network.addListener('networkStatusChange', (status) => {
      this.connected = status.connected;
    });

    Network.getStatus().then((status) => {
      this.connected = status.connected;
    });
  }
}
