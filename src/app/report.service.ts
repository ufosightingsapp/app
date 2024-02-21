import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { BackendService } from './backend.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private _storage: Storage | null = null;
  public reportsChanged: Subject<boolean> = new Subject<boolean>();

  constructor(private backend: BackendService, private storage: Storage) {
    this.init();
  }

  public async init() {
    this._storage = await this.storage.create();
  }

  async upvote(reportId: any) {
    let hasVoted = await this.hasVoted(reportId);
    if (hasVoted) return;
    this._storage?.set(`reports:${reportId}:voted`, 'up');
    this.backend
      .post(`/reports/upvote/${reportId}`, {}, null)
      .subscribe((data) => {
        // Do smth.
      });
  }

  async downvote(reportId: any) {
    let hasVoted = await this.hasVoted(reportId);
    if (hasVoted) return;
    this._storage?.set(`reports:${reportId}:voted`, 'down');
    this.backend
      .post(`/reports/downvote/${reportId}`, {}, null)
      .subscribe((data) => {
        // Do smth.
      });
  }

  async hasVoted(reportId: any): Promise<boolean> {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.init();
        setTimeout(() => {
          this.hasVoted(reportId).then(resolve);
        }, 100);
      });
    }
    let hasVoted = await this._storage?.get(`reports:${reportId}:voted`);
    return hasVoted == 'down' || hasVoted == 'up';
  }

  async getVoteType(reportId: any): Promise<string> {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.init();
        setTimeout(() => {
          this.getVoteType(reportId).then(resolve);
        }, 100);
      });
    }
    return await this._storage?.get(`reports:${reportId}:voted`);
  }

  async triggerRefresh() {
    this.reportsChanged.next(true);
  }
}
