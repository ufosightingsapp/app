import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from 'src/app/backend.service';
import { ModalController } from '@ionic/angular';
import { ReportService } from 'src/app/report.service';
import { MarkerHolderService } from 'src/app/marker-holder.service';
import { SpotService } from 'src/app/spot.service';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss'],
})
export class InfoWindowComponent implements OnInit {
  @Input() info: any;

  loading: boolean = true;
  reports: any = [];
  spot: any = null;

  constructor(
    private backendService: BackendService,
    public modalCtrl: ModalController,
    public reportService: ReportService,
    public markerHolderService: MarkerHolderService,
    private spotService: SpotService
  ) {
    this.reportService.reportsChanged.subscribe((data) => {
      this.handleInfoRefresh(false);
    });
  }

  ngOnInit() {
    this.loading = true;
    this.backendService
      .getJSON(`/reports/all/${this.info._id}`)
      .subscribe((data: any) => {
        this.loading = false;
        this.reports = data || [];
        if (this.reports.length > 0) {
          this.spot = this.reports[0].spot;
        }

        if (this.reports.length == 0) {
          let markerId = this.markerHolderService.getFromSpotId(this.info._id);
          this.markerHolderService.deleteOne(markerId);
          this.spotService.refresh();
        }
      });
  }

  handleInfoRefresh(event: any) {
    if (this.spot == null) return;

    this.loading = true;
    this.backendService
      .getJSON(`/reports/all/${this.spot._id}`)
      .subscribe(async (data: any) => {
        this.loading = false;
        if (data.length == 0) {
          try {
            await this.modalCtrl.dismiss();
          } catch (error) {}
          window.location.reload();
        }
        this.reports = data;
        if (event) event.target.complete();
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
