import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Subject } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  public notificationsAllowed: boolean = false;
  public notificationsAllowedChanged: Subject<boolean> = new Subject<boolean>();
  public prepareNotificationsForWeeks: number = 4;
  public notifications: any = [];
  public initialized: boolean = false;
  private channelId: string = 'ufosightings';

  constructor(private httpService: BackendService) {
    this.notificationsAllowedChanged.subscribe((value: any) => {
      this.notificationsAllowed = value;
      if (value == true) {
        this.createNotificationChannel();
        this.clearNotifications();
        this.requestNotificationConfiguration();
      }
    });
  }

  public async init() {
    if (this.initialized) return;
    let permissions = {
      display: 'denied',
    };
    try {
      permissions = await LocalNotifications.checkPermissions();
    } catch (e: any) {
      this.httpService.log(e.message, 'error', 'LocalNotificationsService');
    }
    if (permissions.display != 'granted') {
      this.scheduleForPermissionRequest();
      this.listenForGrantedPermissions();
      return;
    }
    this.initialized = true;
    this.notificationsAllowedChanged.next(true);
  }

  private async listenForGrantedPermissions() {
    let permissions = {
      display: 'denied',
    };
    try {
      permissions = await LocalNotifications.checkPermissions();
    } catch (e: any) {
      this.httpService.log(e.message, 'error', 'LocalNotificationsService');
    }

    if (permissions.display != 'granted') {
      setTimeout(async () => {
        this.listenForGrantedPermissions();
      }, 1000);
      return;
    }

    this.initialized = true;
    this.notificationsAllowedChanged.next(true);
  }

  private createNotificationChannel() {
    LocalNotifications.listChannels()
      .then((result: any) => {
        if (
          result.channels.find((ch: any) => ch.id === this.channelId) !==
          undefined
        )
          return;
        LocalNotifications.createChannel({
          id: this.channelId,
          name: 'ufosightings',
          importance: 5,
          sound: 'sound.wav',
          lightColor: '1f1f1f',
          visibility: 1,
          vibration: true,
        });
      })
      .catch((e: any) => {
        this.httpService.log(e.message, 'error', 'LocalNotificationsService');
      });
  }

  clearNotifications() {
    LocalNotifications.getPending().then((result: any) => {
      result.notifications.forEach((notification: any) => {
        if (notification.id == 1) return; // skip notification for background mode (id:1
        LocalNotifications.cancel({ notifications: [{ id: notification.id }] });
      });
    });
  }

  scheduleForPermissionRequest() {
    LocalNotifications.schedule({
      notifications: [
        {
          channelId: this.channelId,
          title: 'UFO Sightings',
          body: 'You are already using UFO Sightings for a week! Tell us how you like it and what we can do better by using our contact form.',
          id: 2,
          schedule: { at: new Date(Date.now() + 24 * 60 * 60 * 7 * 1000) },
          sound: 'sound.wav',
        },
      ],
    });
  }

  requestNotificationConfiguration() {
    this.httpService.getJSON('/notifications/json').subscribe(
      (data: any) => {
        if (!data || data.length == 0) return;
        this.notifications = data;
        this.notifications.forEach((notification: any) => {
          if (
            typeof notification.schedule != 'undefined' &&
            typeof notification.schedule.every != 'undefined' &&
            notification.schedule.every == 'week'
          ) {
            this.planNotificationForCommingWeeks(notification);
            return;
          }

          if (
            typeof notification.schedule != 'undefined' &&
            typeof notification.schedule.at != 'undefined'
          ) {
            LocalNotifications.schedule({
              notifications: [notification],
            });
            return;
          }
        });
      },
      (error: any) => {}
    );
  }

  planNotificationForCommingWeeks(notification: any) {
    let currentDay = new Date().getDay(); // Day of the month
    let dayToSet = notification.schedule.on.weekday - 1; // weekday 0-6 0=Sunday 6=Saturday
    let distance = dayToSet - currentDay;
    let publishDate = new Date();
    publishDate.setDate(publishDate.getDate() + distance);
    publishDate.setHours(
      notification.schedule.on.hour || 0,
      notification.schedule.on.minute || 0,
      0,
      0
    ); // Hours, Minutes, Seconds, Milliseconds
    let notificationCollection = [];
    let notificationId = notification.id;

    for (let i = 0; i < this.prepareNotificationsForWeeks; i++) {
      let newNotification: any = {};
      newNotification = Object.assign(newNotification, notification);
      newNotification.channelId = this.channelId;
      newNotification.id = parseInt(
        notificationId + '' + i + '' + Math.floor(Math.random() * 9999),
        10
      ); // Random id otherway it will overwrite the same notification
      let atDate = new Date(publishDate);
      newNotification.schedule = {
        at: atDate,
        allowWhileIdle: true,
      };
      if (newNotification.schedule.at.getTime() >= new Date().getTime())
        notificationCollection.push(newNotification);
      publishDate.setDate(publishDate.getDate() + 7);
    }

    LocalNotifications.schedule({
      notifications: notificationCollection,
    });
  }
}
