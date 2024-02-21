import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss'],
})
export class GuideComponent implements OnInit {
  showGuide: boolean = false;
  _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async readGuideValue() {
    if (!this._storage) await this.init();
    return await this._storage?.get('map:guide');
  }

  ngOnInit() {
    this.readGuideValue().then((value) => {
      if (value != 'shown') {
        this._storage?.set('map:guide', 'shown');
        this.showGuide = true;
      } else {
        this.showGuide = false;
      }
    });
  }

  hide() {
    this.showGuide = false;
  }
}
