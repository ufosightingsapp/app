import { Component, OnInit } from '@angular/core';
import { UsageService } from './usage.service';
import { AmplitudeService } from './amplitude.service';
import { FcmService } from './fcm.service';
import { UpdaterService } from './updater.service';
import { ConnectionService } from './connection.service';
import { Network } from '@capacitor/network';
import { register } from 'swiper/element/bundle';
import { Browser } from '@capacitor/browser';
import { ModalController, Platform } from '@ionic/angular';
import { AppPopupComponent } from './app-popup/app-popup.component';
import { ReportsStreamPage } from './reports-stream/reports-stream.page';
import { HowToPage } from './how-to/how-to.page';
import { ContactPage } from './contact/contact.page';
import { PrivacyPolicyPage } from './privacy-policy/privacy-policy.page';
import { SpotService } from './spot.service';
import { ModalHolderService } from './modal-holder.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationStorageService } from './notification-storage.service';
import { MyreportsComponent } from './myreports/myreports.component';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { Device } from '@capacitor/device';
import { UserService } from './user.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public connected: boolean = true;

  public appPages: any = [];

  constructor(
    private usageService: UsageService,
    private amplitudeService: AmplitudeService,
    private fcm: FcmService,
    private updateService: UpdaterService,
    private connectionService: ConnectionService,
    private platform: Platform,
    private modalCtrl: ModalController,
    private modalHolder: ModalHolderService,
    private spotService: SpotService,
    public notificationService: NotificationStorageService,
    private translocoService: TranslocoService,
    private translocoHttpLoader: TranslocoHttpLoader,
    private userService: UserService
  ) {
    this.usageService.initialize();
    this.amplitudeService.identify();
    this.amplitudeService.track('App started', null);
    this.fcm.addListeners();
    this.fcm.resetBatchCount();
    this.checkForUpdates();

    Network.addListener('networkStatusChange', (status) => {
      this.connected = status.connected;
    });

    Network.getStatus().then((status) => {
      this.connected = status.connected;
    });

    (window as any).openBrowser = (element: any, event: any) => {
      event.preventDefault();
      Browser.open({ url: element.href });
      return false;
    };

    (window as any).initInAppBrowserLinks = () => {
      (document as any)
        .querySelectorAll('.in-app-browser')
        .forEach((element: any) => {
          if (element.classList.contains('in-app-browser-initialized')) {
            return;
          }
          element.addEventListener('click', (event: any) => {
            event.preventDefault();
            Browser.open({ url: element.href });
            return false;
          });
          element.classList.add('in-app-browser-initialized');
        });
      setTimeout(() => {
        (window as any).initInAppBrowserLinks();
      }, 1000);
    };
    (window as any).initInAppBrowserLinks();

    if (this.platform.is('android') && this.platform.is('mobileweb')) {
      this.modalCtrl
        .create({
          component: AppPopupComponent,
          breakpoints: [0, 0.34],
          initialBreakpoint: 0.34,
        })
        .then((modal) => {
          modal.present();
        });
    }
  }

  ngOnInit(): void {
    Device.getLanguageCode().then((language) => {
      try {
        let lang: string = language.value.toLowerCase();
        if (lang.indexOf('-') >= 1) {
          lang = lang.split('-')[0].toLowerCase();
        }
        this.userService.set('deviceLanguage', lang);
        let langs: any = this.translocoService.getAvailableLangs();
        let found = false;
        for (let lcode of langs) {
          if (lcode == lang) {
            found = true;
          }
        }
        if (found) {
          this.translocoService.setActiveLang(lang);
        } else {
          this.translocoService.setActiveLang('en');
        }
      } catch (e) {
        this.translocoService.setActiveLang('en');
      }
      this.initAppPages();
    });
  }

  openPage(func: any) {
    func();
  }

  checkForUpdates() {
    this.updateService.hasAvailable().then((hasAvailable) => {
      if (hasAvailable) {
        this.updateService.promptUpdate();
      }
    });
  }

  openTelegram() {
    window.open('https://t.me/ufosightingsapp', '_system');
  }

  openStarlinkTracker() {
    window.open('https://ufosightings.app/starlink-tracker', '_system');
  }

  async openReports() {
    let modalHandle = await this.modalCtrl.create({
      component: ReportsStreamPage,
      componentProps: {
        navigate: (url: string) => {
          this.spotService.navigate(url);
        },
      },
    });
    modalHandle.present();
  }

  async closeModals() {
    try {
      await this.modalCtrl.dismiss();
    } catch (e) {}
  }

  initAppPages() {
    this.translocoHttpLoader
      .getTranslation(this.translocoService.getActiveLang())
      .subscribe((translation: any) => {
        this.appPages = [
          {
            title: translation.navigation.side.myreports,
            url: '/my-reports',
            icon: 'list',
            onClick: () => {
              this.modalCtrl
                .create({
                  component: MyreportsComponent,
                })
                .then((modal) => {
                  modal.present();
                });
            },
          },
          {
            title: translation.navigation.side.howto,
            url: '/howto',
            icon: 'help',
            onClick: () => {
              this.modalCtrl
                .create({
                  component: HowToPage,
                })
                .then((modal) => {
                  modal.present();
                });
            },
          },
          {
            title: translation.navigation.side.contact,
            url: '/contact',
            icon: 'mail',
            onClick: () => {
              this.modalCtrl
                .create({
                  component: ContactPage,
                })
                .then((modal) => {
                  modal.present();
                });
            },
          },
          {
            title: translation.navigation.side.privacy,
            url: '/privacy-policy',
            icon: 'document-text',
            onClick: () => {
              this.modalCtrl
                .create({
                  component: PrivacyPolicyPage,
                })
                .then((modal) => {
                  modal.present();
                });
            },
          },
        ];
      });
  }
}
