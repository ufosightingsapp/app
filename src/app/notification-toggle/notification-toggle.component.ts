import { Component, OnInit } from '@angular/core';
import { NotificationStorageService } from '../notification-storage.service';
import { ModalController } from '@ionic/angular';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-notification-toggle',
  templateUrl: './notification-toggle.component.html',
  styleUrls: ['./notification-toggle.component.scss'],
})
export class NotificationToggleComponent implements OnInit {
  constructor(
    public notificationStorageService: NotificationStorageService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  async open() {
    let modalHandle = await this.modalCtrl.create({
      component: NotificationsComponent,
    });
    modalHandle.present();
  }
}
