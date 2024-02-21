import { Component, OnInit } from '@angular/core';
import { MapFilterService } from '../map-filter.service';
import { ModalController, ToastController } from '@ionic/angular';
import { AmplitudeService } from '../amplitude.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  toDate: string;
  fromDate: string;

  constructor(
    private mapFilterService: MapFilterService,
    private toastController: ToastController,
    private amplitudeService: AmplitudeService,
    private modalCtrl: ModalController,
    private translocoService: TranslocoService
  ) {
    let lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    this.fromDate = lastYear.toISOString();
    this.toDate = new Date().toISOString();

    this.mapFilterService.getTime().then((time: any) => {
      if (
        time &&
        typeof time.from != 'undefined' &&
        typeof time.to != 'undefined' &&
        time.from &&
        time.to
      ) {
        this.fromDate = time.from;
        this.toDate = time.to;
      }
    });
  }

  onFromChange(event: any) {
    this.fromDate = event.detail.value;
    this.mapFilterService.setTime(this.fromDate, this.toDate);
    this.toastController
      .create({
        message: this.translocoService.translate(
          'filter.toasts.filter_applied'
        ),
        duration: 2000,
        position: 'bottom',
      })
      .then((toastHandler) => {
        toastHandler.present();
      });
    this.amplitudeService.track('filter:applied', { type: 'time' });
  }

  onToChange(event: any) {
    this.toDate = event.detail.value;
    this.mapFilterService.setTime(this.fromDate, this.toDate);
    this.toastController
      .create({
        message: this.translocoService.translate(
          'filter.toasts.filter_applied'
        ),
        duration: 2000,
        position: 'bottom',
      })
      .then((toastHandler) => {
        toastHandler.present();
      });
    this.amplitudeService.track('filter:applied', { type: 'time' });
  }

  async fromString(timeString: string) {
    this.mapFilterService.setTimeString(timeString);
    let toastHandler = await this.toastController.create({
      message: this.translocoService.translate('filter.toasts.filter_applied'),
      duration: 2000,
      position: 'bottom',
    });
    await toastHandler.present();
    this.amplitudeService.track('filter:applied', { type: 'timeString' });
  }

  async clear() {
    this.mapFilterService.clear();
    let toastHandler = await this.toastController.create({
      message: this.translocoService.translate('filter.toasts.filter_cleared'),
      duration: 2000,
      position: 'bottom',
    });
    await toastHandler.present();
    this.amplitudeService.track('filter:cleared', {});
  }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  backToMap() {
    this.modalCtrl.dismiss();
  }
}
