import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { BackendService } from '../backend.service';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController, ToastController } from '@ionic/angular';
import { InfoWindowComponent } from './info-window/info-window.component';
import { ReportFormWindowComponent } from './report-form-window/report-form-window.component';
import { MarkerHolderService } from '../marker-holder.service';
import { SpotService } from '../spot.service';
import { MapFilterService } from '../map-filter.service';
import { ActivatedRoute } from '@angular/router';
import { AmplitudeService } from '../amplitude.service';
import { UserService } from '../user.service';
import { ModalHolderService } from '../modal-holder.service';
import { FilterPage } from '../filter/filter.page';
import { MapListenerCallback } from '@capacitor/google-maps/dist/typings/definitions';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  apiKey = '[API_KEY_HERE]';
  @ViewChild('map', { read: ElementRef }) mapRef: ElementRef;
  sightingMap: GoogleMap;
  params: any;

  myLocation: any = {
    latitude: 33.6,
    longitude: -117.9,
  };

  mapLoading: boolean = true;
  listenersInitialized: boolean = false;

  subscriptions: any = {};

  constructor(
    private backendService: BackendService,
    private modalCtrl: ModalController,
    private markerHolderService: MarkerHolderService,
    private spotService: SpotService,
    private mapFilterService: MapFilterService,
    private route: ActivatedRoute,
    private amplitudeService: AmplitudeService,
    private toastController: ToastController,
    private userService: UserService,
    private modalHolder: ModalHolderService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    this.subscriptions.spotAdd = this.spotService.spotAdded.subscribe(
      async (data: any) => {
        this.amplitudeService.track('spot:added', {});
        if (this.markerHolderService.getFromSpotId(data._id) != null) {
          return;
        }
        let markerId = await (window as any).sightingMap.addMarker({
          coordinate: {
            lat: data.latitude,
            lng: data.longitude,
          },
          iconUrl: 'assets/images/marker-blue.png',
          iconSize: {
            height: 48,
            width: 39,
          },
        });
        this.markerHolderService.add(markerId, data._id);
      }
    );

    this.subscriptions.spotChange = this.spotService.spotsChanged.subscribe(
      () => {
        this.amplitudeService.track('spot:changed', {});
        this.loadSpots();
      }
    );

    this.subscriptions.spotNavigate = this.spotService.spotsNavigate.subscribe(
      (spotId: string) => {
        this.navigateSpot(spotId);
      }
    );

    this.route.paramMap.subscribe((paramMap) => {
      this.params = paramMap;
      if (typeof (window as any).sightingMap != 'undefined') {
        this.readParams();
      }
    });

    (window as any).openSpot = (spotId: string) => {
      this.backendService
        .getJSON(`/spots/single/${spotId}`)
        .subscribe(async (data: any) => {
          if (typeof data == 'undefined' || typeof data._id == 'undefined') {
            alert(this.translocoService.translate('map.alerts.unknown_spot'));
            return;
          }

          setTimeout(() => {
            this.modalCtrl
              .create({
                component: InfoWindowComponent,
                componentProps: {
                  info: data,
                },
              })
              .then(async (modal) => {
                this.modalHolder.close();
                this.modalHolder.set(modal);
                this.modalHolder.present();
              });
          }, 1000);
        });
    };
  }

  async ngAfterViewInit() {
    await this.getCurrentPosition();
    if ((window as any).sightingMap == null) {
      await this.createMap();
      await this.loadSpots();
      await this.createListeners();
    }
    await this.readParams();
    this.mapLoading = false;
  }

  async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.myLocation.latitude = coordinates.coords.latitude;
      this.myLocation.longitude = coordinates.coords.longitude;
      this.userService.set('lastLocation', {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
      });
    } catch (error) {}
  }

  async createMap() {
    return await new Promise(async (resolve, reject) => {
      try {
        (window as any).sightingMap = await GoogleMap.create({
          id: 'map',
          element: this.mapRef.nativeElement,
          apiKey: this.apiKey,
          forceCreate: true,
          config: {
            center: {
              lat: this.myLocation.latitude,
              lng: this.myLocation.longitude,
            },
            zoom: 8,
          },
        });
        (window as any).sightingMap.enableClustering();
        resolve(true);
      } catch (error) {
        console.log(error);
        setTimeout(async () => {
          await this.createMap();
          resolve(true);
        }, 1000);
      }
    });
  }

  async createListeners() {
    if (this.listenersInitialized) {
      return;
    }
    this.listenersInitialized = true;

    /**
     * On map click, open report form
     */
    (window as any).sightingMap.setOnMapClickListener(async (event: any) => {
      this.modalCtrl
        .create({
          component: ReportFormWindowComponent,
          componentProps: {
            info: {
              ...event,
            },
          },
        })
        .then((modal) => {
          this.modalHolder.close();
          this.modalHolder.set(modal);
          this.modalHolder.present();
        });
    });

    /**
     * On marker click, open info window
     */
    (window as any).sightingMap.setOnMarkerClickListener(async (event: any) => {
      this.amplitudeService.track('spot:clicked', {});
      let spotId = this.markerHolderService.get(event.markerId);
      this.modalCtrl
        .create({
          component: InfoWindowComponent,
          componentProps: {
            info: {
              ...event,
              _id: spotId,
            },
          },
        })
        .then(async (modal) => {
          this.modalHolder.close();
          this.modalHolder.set(modal);
          this.modalHolder.present();
        });
    });
  }

  spotsEqual(newSpots: any, currentSpots: any) {
    let isEqual = true;
    for (let i = 0; i < newSpots.length; i++) {
      if (currentSpots.indexOf(newSpots[i]) == -1) {
        isEqual = false;
        break;
      }
    }

    for (let i = 0; i < currentSpots.length; i++) {
      if (newSpots.indexOf(currentSpots[i]) == -1) {
        isEqual = false;
        break;
      }
    }

    return isEqual;
  }

  async loadSpots(): Promise<void> {
    return await new Promise(async (resolve) => {
      let data = this.spotService.get();
      data = (await this.mapFilterService.filterSpots(data)) || [];

      let currentSpots = this.markerHolderService.getAllSpotIds();
      let newSpots = data.map((spot: any) => spot._id);

      // Don't update if spots are equal
      if (this.spotsEqual(newSpots, currentSpots)) {
        resolve();
        return;
      }

      // Reset map & build new
      this.markerHolderService.clear();
      this.listenersInitialized = false;
      if (typeof (window as any).sightingMap !== 'undefined')
        await (window as any).sightingMap.destroy();
      await this.createMap();
      await this.createListeners();

      // If no spots, show a toast and return
      if (data == null || data.length == 0) {
        let toastHandler = await this.toastController.create({
          message: this.translocoService.translate(
            'map.toasts.no_spots_in_time'
          ),
          duration: 2000,
        });
        toastHandler.present();
        return;
      }

      // Build marker objects and add to map
      let markers: any[] = [];
      let markerIds: any[] = [];
      for (let i = 0; i < data.length; i++) {
        let spot = data[i];
        markers.push({
          coordinate: {
            lat: spot.latitude,
            lng: spot.longitude,
          },
          iconUrl: 'assets/images/marker-blue.png',
          iconSize: {
            height: 48,
            width: 39,
          },
        });
      }

      if (markers.length > 0) {
        markerIds = await (window as any).sightingMap.addMarkers(markers);
      }

      // Add marker to marker holder service
      for (let i = 0; i < data.length; i++) {
        let spot = data[i];
        this.markerHolderService.add(markerIds[i], spot._id);
      }
      resolve();
    });
  }

  navigationTimeout: any = null;
  async navigateSpot(spotId: string, zoom: boolean = true) {
    if (this.mapLoading) {
      if (this.navigationTimeout != null) clearTimeout(this.navigationTimeout);
      this.navigationTimeout = setTimeout(() => {
        this.navigateSpot(spotId, zoom);
      }, 1000);
      return;
    }
    this.amplitudeService.track('navigation:spot', {});
    this.backendService
      .getJSON(`/spots/single/${spotId}`)
      .subscribe(async (data: any) => {
        if (typeof data == 'undefined' || typeof data._id == 'undefined') {
          alert(this.translocoService.translate('map.alerts.unknown_spot'));
          return;
        }

        if (zoom) {
          await (window as any).sightingMap.setCamera({
            coordinate: {
              lat: data.latitude,
              lng: data.longitude,
            },
            zoom: 10,
          });
          //await this.animatedZoomIn(5, 15, 0.01, 1);
        }

        if (this.markerHolderService.getFromSpotId(data._id) == null) {
          let markerId = await (window as any).sightingMap.addMarker({
            coordinate: {
              lat: data.latitude,
              lng: data.longitude,
            },
            iconUrl: 'assets/images/marker-blue.png',
            iconSize: {
              height: 48,
              width: 39,
            },
          });
          this.markerHolderService.add(markerId, data._id);
        }

        setTimeout(() => {
          this.modalCtrl
            .create({
              component: InfoWindowComponent,
              componentProps: {
                info: data,
              },
            })
            .then(async (modal) => {
              this.modalHolder.close();
              this.modalHolder.set(modal);
              this.modalHolder.present();
            });
        }, 1000);
      });
  }

  async readParams(zoom = true) {
    if (typeof this.params == 'undefined') return;
    let spotId = this.params.get('spotId');
    if (spotId == null) return;
    await this.navigateSpot(spotId, zoom);
  }

  async animatedZoomIn(
    start: number,
    end: number,
    stepSize: number = 1,
    stepDuration: number = 300
  ) {
    return await new Promise(async (resolve) => {
      if (start > end) {
        resolve(true);
        return;
      }
      await (window as any).sightingMap.setCamera({
        zoom: start,
      });
      start += stepSize;
      setTimeout(async () => {
        await this.animatedZoomIn(start, end).then(resolve);
      }, stepDuration);
    });
  }

  ngOnDestroy(): void {}

  async openFilter() {
    let modalHandle = await this.modalCtrl.create({
      component: FilterPage,
    });
    modalHandle.onDidDismiss().then(() => {
      this.loadSpots();
    });
    modalHandle.present();
  }

  async moveMyLocation() {
    await this.getCurrentPosition();
    await (window as any).sightingMap.setCamera({
      coordinate: {
        lat: this.myLocation.latitude,
        lng: this.myLocation.longitude,
      },
      zoom: 10,
    });
  }
}
