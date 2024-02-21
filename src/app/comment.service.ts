import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BackendService } from './backend.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private _storage: Storage | null = null;
  public commentsChanged: Subject<boolean> = new Subject<boolean>();

  constructor(private backend: BackendService, private storage: Storage) {
    this.init();
  }

  public async init() {
    this._storage = await this.storage.create();
  }

  async upvote(commentId: any) {
    let hasVoted = await this.hasVoted(commentId);
    if (hasVoted) return;
    this._storage?.set(`comments:${commentId}:voted`, 'up');
    this.backend
      .post(`/reports/comments/upvote/${commentId}`, {}, null)
      .subscribe((data) => {
        // Do smth.
      });
  }

  async downvote(commentId: any) {
    let hasVoted = await this.hasVoted(commentId);
    if (hasVoted) return;
    this._storage?.set(`comments:${commentId}:voted`, 'down');
    this.backend
      .post(`/reports/comments/downvote/${commentId}`, {}, null)
      .subscribe((data) => {
        // Do smth.
      });
  }

  async hasVoted(commentId: any): Promise<boolean> {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.init();
        setTimeout(() => {
          this.hasVoted(commentId).then(resolve);
        }, 100);
      });
    }
    let hasVoted = await this._storage?.get(`comments:${commentId}:voted`);
    return hasVoted == 'down' || hasVoted == 'up';
  }

  async getVoteType(commentId: any): Promise<string> {
    if (this._storage == null) {
      return await new Promise((resolve) => {
        this.init();
        setTimeout(() => {
          this.getVoteType(commentId).then(resolve);
        }, 100);
      });
    }
    return await this._storage?.get(`comments:${commentId}:voted`);
  }

  async triggerRefresh() {
    this.commentsChanged.next(true);
  }
}
