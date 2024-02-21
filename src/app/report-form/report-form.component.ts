import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import {
  AlertController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { ReportService } from '../report.service';
import { SpotService } from '../spot.service';
import { UserService } from '../user.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'],
})
export class ReportFormComponent implements OnInit {
  files: any = [];
  uploadRunning = false;
  submitting = false;
  @Input() spot: any;

  currentStep = 0;
  steps = 3;
  stepVerifications: any = {
    '0': () => {
      return true;
    },
    '1': () => {
      let valid =
        this.formValue.text.trim() != '' &&
        this.countWords(this.formValue.text) > 10;
      if (!valid) {
        this.alertCtrl
          .create({
            header: this.translocoService.translate(
              'reportform.alerts.steps.2.title'
            ),
            message: this.translocoService.translate(
              'reportform.alerts.steps.2.text'
            ),
            buttons: ['OK'],
            cssClass: 'custom-alert-wrapper',
          })
          .then((alertHndl) => {
            alertHndl.present();
          });
      }
      return valid;
    },
    '2': () => {
      if (this.uploadRunning) {
        this.alertCtrl
          .create({
            header: this.translocoService.translate(
              'reportform.alerts.steps.3.title'
            ),
            message: this.translocoService.translate(
              'reportform.alerts.steps.3.text'
            ),
            buttons: ['OK'],
            cssClass: 'custom-alert-wrapper',
          })
          .then((alertHndl) => {
            alertHndl.present();
          });
        return false;
      }
      return true;
    },
    '3': () => {
      return true;
    },
  };

  formValue: any = {
    creationTime: new Date().toISOString(),
    text: '',
  };

  constructor(
    private backendService: BackendService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private reportService: ReportService,
    private spotService: SpotService,
    private userService: UserService,
    private platform: Platform,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {}

  nextStep() {
    if (!this.stepVerifications[this.currentStep]()) return;
    if (this.currentStep < this.steps) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 0) this.currentStep--;
  }

  checkDateString(dateStr: string) {
    let date = new Date(dateStr);
    if (date.getTime() > new Date().getTime()) {
      return false;
    }
    return true;
  }

  async onDateChange(event: any) {
    if (!this.checkDateString(event.detail.value)) {
      let alert = await this.alertCtrl.create({
        header: this.translocoService.translate(
          'reportform.alerts.date.invalid.title'
        ),
        message: this.translocoService.translate(
          'reportform.alerts.date.invalid.text'
        ),
        buttons: ['OK'],
        cssClass: 'custom-alert-wrapper',
      });

      alert.present();
    }
    this.formValue.creationTime = event.detail.value;
  }

  onTextChange(event: any) {
    this.formValue.text = event.detail.value;
  }

  onFilesChange(event: any) {
    this.files = event;
  }

  onUploadChange(event: any) {
    this.uploadRunning = event;
  }

  YouTubeParser(url: string): boolean | string {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);

    // YouTube Video
    if (match && match[7] && match[7].length == 11) {
      return match[7];
    }

    // YouTube Shorts Video
    if (match && match[8] && match[8].length == 11) {
      return match[8];
    }

    return false;
  }

  onYouTubeChange(event: any) {
    this.formValue.youtube = event.detail.value;
  }

  TikTokVerification(url: string): boolean {
    var regExp = /^https:\/\/.*(tiktok.com\/)/gim;
    var match = url.match(regExp);
    return match ? true : false;
  }

  generateTikTokId(url: string): string {
    // remove all special chars from url string
    url = url.replace(/[^a-zA-Z0-9]/g, '');
    return url;
  }

  onTikTokChange(event: any) {
    this.formValue.tiktok = event.detail.value;
  }

  onYouTubeShortsChange(event: any) {
    this.formValue.youtubeshorts = event.detail.value;
  }

  countWords(text: any) {
    let words = text.split(' ');
    let count = 0;
    for (let i = 0; i < words.length; i++) {
      if (words[i].trim() != '') {
        count++;
      }
    }
    return count;
  }

  async submit() {
    this.submitting = true;

    if (!this.checkDateString(this.formValue.creationTime)) {
      alert(
        this.translocoService.translate('reportform.alerts.submit.invalid_date')
      );
      this.submitting = false;
      return;
    }

    this.formValue.text = this.formValue.text.trim();
    if (
      this.formValue.text == '' ||
      this.countWords(this.formValue.text) < 10
    ) {
      alert(
        this.translocoService.translate(
          'reportform.alerts.submit.invalid_report'
        )
      );
      this.submitting = false;
      return;
    }

    let media = this.files;

    if (this.formValue.youtube) {
      let youtubeId = this.YouTubeParser(this.formValue.youtube);
      if (!youtubeId) {
        alert(
          this.translocoService.translate(
            'reportform.alerts.submit.invalid_youtube'
          )
        );
        this.submitting = false;
        return;
      }
      media.push({
        id: youtubeId,
        type: 'youtube',
        filename: youtubeId,
      });
      delete this.formValue.youtube;
    }

    if (this.formValue.youtubeshorts) {
      let youtubeId = this.YouTubeParser(this.formValue.youtubeshorts);
      if (!youtubeId) {
        alert(
          this.translocoService.translate(
            'reportform.alerts.submit.invalid_youtube_short'
          )
        );
        this.submitting = false;
        return;
      }
      media.push({
        id: youtubeId,
        type: 'youtubeshorts',
        filename: youtubeId,
      });
      delete this.formValue.youtubeshorts;
    }

    if (this.formValue.tiktok) {
      let isTikTokURL = this.TikTokVerification(this.formValue.tiktok);
      if (!isTikTokURL) {
        alert(
          this.translocoService.translate(
            'reportform.alerts.submit.invalid_tiktok'
          )
        );
        this.submitting = false;
        return;
      }
      let tiktokId = this.generateTikTokId(this.formValue.tiktok);
      media.push({
        id: tiktokId,
        type: 'tiktok',
        url: this.formValue.tiktok,
      });
      delete this.formValue.tiktok;
    }

    this.formValue.media = media;
    this.formValue.spot = this.spot;
    this.backendService
      .post('/reports/insert', this.formValue, null)
      .subscribe((data) => {
        if (typeof data._id == 'undefined') {
          alert(
            this.translocoService.translate(
              'reportform.alerts.submit.send_error'
            )
          );
          return;
        }
        this.submitting = false;
        if (typeof this.formValue.spot._id == 'undefined') {
          this.spotService.addSpot(data.spot);
        }
        this.formValue = {
          creationTime: new Date().toISOString(),
          text: '',
        };
        this.files = [];
        this.reportService.triggerRefresh();
        this.modalCtrl.dismiss();

        if (data.authorIdentifier) {
          this.userService.set('authorId', data.authorIdentifier);
        }
      });
  }
}
