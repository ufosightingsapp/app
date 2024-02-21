import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotificationStorageService } from '../notification-storage.service';
import { SpotService } from '../spot.service';
import { FcmService } from '../fcm.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  loading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private notificationService: NotificationStorageService,
    private spotService: SpotService,
    private fcmServce: FcmService
  ) {}

  ngOnInit() {
    this.refresh();
    this.requestPermission();
  }

  async requestPermission() {
    const canRequest = await this.fcmServce.canRequestPermission();
    if (canRequest) {
      let hasPermission = await this.fcmServce.hasPermissions();
      if (!hasPermission) {
        this.fcmServce.registerNotifications();
      }
    }
  }

  async refresh(event: any = null) {
    let deliveredNotifications =
      await this.fcmServce.getDeliveredNotifications();
    console.log(deliveredNotifications);
    this.notifications = await this.notificationService.getList();
    console.log(this.notifications);
    this.notificationService.setAllSeen();
    if (event != null) event.target.complete();
  }

  open(notification: any) {
    if (notification.data.spotId) {
      this.modalCtrl.dismiss();
      this.spotService.navigate(notification.data.spotId);
      return;
    }
    this.modalCtrl.dismiss();
  }

  clear() {
    this.notificationService.clear();
    this.refresh();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
