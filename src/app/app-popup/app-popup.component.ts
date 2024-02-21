import { Component, OnInit } from '@angular/core';
import { UpdaterService } from '../updater.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-app-popup',
  templateUrl: './app-popup.component.html',
  styleUrls: ['./app-popup.component.scss'],
})
export class AppPopupComponent implements OnInit {
  constructor(
    private updater: UpdaterService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  openPlayStore() {
    window.open(this.updater.STORE_URL, '_system');
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
