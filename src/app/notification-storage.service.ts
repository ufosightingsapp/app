import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationStorageService {
  private _storage: Storage | null = null;
  public count: any = {
    unread: 0,
  };

  constructor(private storage: Storage) {
    this.init();
  }

  public async init() {
    this._storage = await this.storage.create();
    setInterval(() => {
      this.unreadCount();
    }, 3000);
  }

  public async waitForStorage() {
    return await new Promise((resolve) => {
      if (this._storage == null) {
        setTimeout(() => {
          this.waitForStorage().then(resolve);
        }, 100);
      } else {
        resolve(true);
      }
    });
  }

  public async getList() {
    await this.waitForStorage();
    return await this._storage?.get('notificationList');
  }

  public async addToList(notification: any) {
    await this.waitForStorage();
    let list = await this.getList();
    if (list == null) {
      list = [];
    }
    notification.seen = false;
    // prepend notification to list
    list = [notification, ...list];
    await this._storage?.set('notificationList', list);
  }

  public async setAllSeen() {
    await this.waitForStorage();
    let list = await this.getList();
    if (list == null) {
      return;
    }
    list.forEach((notification: any) => {
      notification.seen = true;
    });
    await this._storage?.set('notificationList', list);
  }

  public clear() {
    this._storage?.set('notificationList', []);
  }

  public async unreadCount() {
    await this.waitForStorage();
    let list = await this.getList();
    if (list == null) {
      return 0;
    }
    let count = 0;
    list.forEach((notification: any) => {
      if (!notification.seen) {
        count++;
      }
    });
    this.count.unread = count;
    return count;
  }
}
