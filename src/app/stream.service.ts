import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private _storage: Storage | null = null;
  loading: boolean = false;

  body: any = {
    sort: {
      'scoring.hot': -1,
    },
    query: {},
    limit: 5,
    skip: 0,
  };
  bodyReloaded: Subject<boolean> = new Subject<boolean>();

  reports: any[] = [];

  constructor(private backend: BackendService, private storage: Storage) {
    this.storage.create().then((storage: any) => {
      this._storage = storage;
      this._storage?.get('stream:body').then((body) => {
        if (body) {
          this.body.sort = body.sort;
          this.body.query = body.query;
          this.bodyReloaded.next(true);
        }
        this.getStream();
      });
    });
  }

  async getStream() {
    this.persist();
    this.loading = true;
    return await new Promise((resolve, reject) => {
      this.backend
        .post(`/reports/dynamic`, this.body, null)
        .subscribe(async (data) => {
          this.loading = false;
          // prepend data to this.reports
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              let read = await this.hasRead(data[i]._id);
              data[i].unread = !read;
              if (data[i].unread) this.setRead(data[i]._id);
            }
            this.reports = [...this.reports, ...data];
          }
          resolve(data);
        });
    });
  }

  clearStream() {
    this.reports = [];
    this.body.skip = 0;
  }

  setSort(key: any, direction: Number = -1) {
    delete this.body.sort;
    this.body.sort[key] = direction;
    this.clearStream();
    this.getStream();
  }

  setCountry(country: String) {
    delete this.body.query['spot.country'];
    this.body.query['spot.country'] = country;
    this.clearStream();
    this.getStream();
  }

  clearCountry() {
    delete this.body.query['spot.country'];
    delete this.body.query['spot.state'];
    delete this.body.query['spot.city'];
    this.clearStream();
    this.getStream();
  }

  setState(state: String) {
    delete this.body.query['spot.state'];
    this.body.query['spot.state'] = state;
    this.clearStream();
    this.getStream();
  }

  clearState() {
    delete this.body.query['spot.state'];
    delete this.body.query['spot.city'];
    this.clearStream();
    this.getStream();
  }

  setCity(city: String) {
    delete this.body.query['spot.city'];
    this.body.query['spot.city'] = city;
    this.clearStream();
    this.getStream();
  }

  clearCity() {
    delete this.body.query['spot.city'];
    this.clearStream();
    this.getStream();
  }

  setMedia(hasMedia: boolean = true) {
    delete this.body.query['media'];
    this.body.query['media'] = {
      $exsists: hasMedia,
    };
    this.clearStream();
    this.getStream();
  }

  clearMedia() {
    delete this.body.query['media'];
    this.clearStream();
    this.getStream();
  }

  setTimeRange(start: Date, end: Date) {
    delete this.body.creationTimeUnix;
    this.body.creationTimeUnix = {
      $gte: start.getTime(),
      $lte: end.getTime(),
    };
    this.clearStream();
    this.getStream();
  }

  clearTimeRange() {
    delete this.body.creationTimeUnix;
    this.clearStream();
    this.getStream();
  }

  async hasRead(reportId: String) {
    return (await this._storage?.get(`report:${reportId}:read`)) !== null;
  }

  setRead(reportId: String) {
    this._storage?.set(`report:${reportId}:read`, true);
  }

  setLimit(limit: Number) {
    this.body.limit = limit;
  }

  setSkip(skip: Number) {
    this.body.skip = skip;
  }

  persist() {
    this._storage?.set('stream:body', this.body);
  }
}
