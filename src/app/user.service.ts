import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DeviceService } from './device.service';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _storage: Storage | null = null;
  private namespace: string = 'user:';
  constructor(
    private storage: Storage,
    private deviceService: DeviceService,
    private backendService: BackendService
  ) {
    this.init();
  }

  init() {
    this.storage.create().then((storage) => {
      this._storage = storage;
    });
  }

  public async get(key: string): Promise<any> {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.init();
        setTimeout(() => {
          this.get(key).then(resolve);
        }, 100);
      });
    }
    return await this._storage?.get(`${this.namespace}${key}`);
  }

  public async set(key: string, value: any) {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.init();
        setTimeout(() => {
          this.set(key, value).then(resolve);
        }, 100);
      });
    }
    let response = await this._storage?.set(`${this.namespace}${key}`, value);
    this.sync();
    return response;
  }

  public async addReport(report: any) {
    let reports = await this.get('reports');
    if (reports == null) {
      reports = [];
    }
    reports = [report, ...reports];
    await this.set('reports', reports);
  }

  public async removeReport(reportId: string) {
    let reports = await this.get('reports');
    if (reports == null) {
      reports = [];
    }
    reports = reports.filter((report: any) => report._id != reportId);
    await this.set('reports', reports);
  }

  public async getReports() {
    let reports = await this.get('reports');
    if (reports == null) {
      reports = [];
    }
    return reports;
  }

  public async addBookmark(report: any) {
    let bookmarks = await this.get('bookmarks');
    if (bookmarks == null) {
      bookmarks = [];
    }
    // prepend report
    bookmarks = [report, ...bookmarks];
    await this.set('bookmarks', bookmarks);
  }

  public async removeBookmark(reportId: string) {
    let bookmarks = await this.get('bookmarks');
    if (bookmarks == null) {
      bookmarks = [];
    }
    bookmarks = bookmarks.filter((report: any) => report._id != reportId);
    await this.set('bookmarks', bookmarks);
  }

  public async getBookmarks() {
    let bookmarks = await this.get('bookmarks');
    if (bookmarks == null) {
      bookmarks = [];
    }
    return bookmarks;
  }

  public async isBookmarked(reportId: string) {
    let bookmarks = await this.get('bookmarks');
    if (bookmarks == null) {
      bookmarks = [];
    }
    return bookmarks.filter((report: any) => report._id == reportId).length > 0;
  }

  public async sync() {
    // get all user: keys from storage and send them as key value object to backend
    if (this._storage == null || this.deviceService.isLoaded == false) {
      return await new Promise((resolve) => {
        this.init();
        setTimeout(() => {
          this.sync().then(resolve);
        }, 100);
      });
    }

    let keys = await this._storage?.keys();
    let userKeys = keys?.filter((key) => key.startsWith(this.namespace));
    let userObject: any = {};
    for (let key of userKeys) {
      let value = await this._storage?.get(key);
      userObject[key.replace(this.namespace, '')] = value;
    }
    userObject._id = this.deviceService.id;
    this.backendService.post('/user/sync', userObject, null).subscribe(
      (res) => {},
      (err) => {}
    );
    return true;
  }
}
