import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ReportFormWindowComponent } from '../map/report-form-window/report-form-window.component';
import { Clipboard } from '@capacitor/clipboard';
import { AmplitudeService } from '../amplitude.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-spot-info',
  templateUrl: './spot-info.component.html',
  styleUrls: ['./spot-info.component.scss'],
})
export class SpotInfoComponent implements OnInit {
  @Input() reports: any;
  @Input() spot: any;
  @Output() refresh = new EventEmitter<any>();

  date = '';

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private amplitudeService: AmplitudeService,
    public reportService: ReportService
  ) {
    this.reportService.init();
  }

  ngOnInit() {
    this.date = new Date(this.spot.creationTime).toLocaleDateString();
    if (typeof this.reports != 'undefined' && this.reports.length >= 1) {
      this.addScoreToReports();
      this.sortReportsByScore();
    }
  }

  sortReportsByScore() {
    this.reports.sort((a: any, b: any) => {
      return b.score - a.score;
    });
  }

  async triggerCreateForm() {
    //this.openCreateForm.emit(event);
    try {
      await this.modalCtrl.dismiss();
    } catch (error) {}
    this.modalCtrl
      .create({
        component: ReportFormWindowComponent,
        componentProps: {
          info: this.spot,
        },
      })
      .then((modal) => {
        modal.present();
      });
  }

  addScoreToReports() {
    this.reports.forEach((report: any, index: number) => {
      report.score = 0;
      report.negativeScorePercent = 0;
      if (typeof report.votes != 'undefined') {
        let averageScore = report.votes.total - report.votes.negative;
        report.score = averageScore;
        report.negativeScorePercent = Math.round(
          (report.votes.negative / report.votes.total) * 100
        );
      }
    });
  }

  handleRefresh(event: any) {
    this.refresh.emit(event);
  }

  removeRefresh() {
    this.refresh.emit();
  }

  async copyShareLink() {
    this.amplitudeService.track('spot:link-copied', {});
    await Clipboard.write({
      string: `https://ufosightings.app/map/${this.spot._id}`,
    });
    const toastHandler = await this.toastController.create({
      message: 'Link copied to clipboard.',
      duration: 2000,
    });
    await toastHandler.present();
  }
}
