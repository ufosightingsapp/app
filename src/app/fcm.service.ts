import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { UserService } from './user.service';
import { Capacitor } from '@capacitor/core';
import { async } from '@angular/core/testing';
import { NotificationStorageService } from './notification-storage.service';
import { ModalHolderService } from './modal-holder.service';
import { NotificationsComponent } from './notifications/notifications.component';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  isPushNotificationsAvailable: boolean =
    Capacitor.isPluginAvailable('PushNotifications');

  constructor(
    private router: Router,
    private platform: Platform,
    private userService: UserService,
    private notificationService: NotificationStorageService,
    private modalCtrl: ModalController,
    private modalHolder: ModalHolderService
  ) {}

  addListeners = async () => {
    if (!this.isPushNotificationsAvailable) return;
    await PushNotifications.addListener('registration', (token) => {
      this.userService.set('fcmToken', token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      //console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        this.notificationService.addToList(notification);
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (action) => {
        this.notificationService.addToList(action.notification);
        this.modalCtrl.dismiss();
        let modal = await this.modalCtrl.create({
          component: NotificationsComponent,
        });
        modal.present();
      }
    );
  };

  registerNotifications = async () => {
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      return;
    }
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
    this.addListeners();
  };

  hasPermissions = async () => {
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      return true;
    }
    const permStatus = await PushNotifications.checkPermissions();
    return permStatus.receive === 'granted';
  };

  canRequestPermission = async () => {
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      return false;
    }
    const permStatus = await PushNotifications.checkPermissions();
    return permStatus.receive === 'prompt';
  };

  getDeliveredNotifications = async () => {
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      return;
    }
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    return notificationList;
  };

  resetBatchCount = async () => {
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      return;
    }
    await PushNotifications.removeAllDeliveredNotifications();
  };
}
