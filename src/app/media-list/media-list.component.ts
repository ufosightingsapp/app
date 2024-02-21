import { Component, Input, OnInit } from '@angular/core';
import { ReportMediaService } from '../report-media.service';
import { BackendService } from '../backend.service';
import { AmplitudeService } from '../amplitude.service';
import { ModalController } from '@ionic/angular';
import { ImageViewComponent } from '../image-view/image-view.component';
import { YoutubeViewComponent } from '../youtube-view/youtube-view.component';
import { VideoViewComponent } from '../video-view/video-view.component';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
})
export class MediaListComponent implements OnInit {
  @Input() media: any;
  selected: any = null;

  constructor(
    private reportMediaService: ReportMediaService,
    private backendService: BackendService,
    private amplitudeService: AmplitudeService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  select(item: any) {
    if (item.type == 'tiktok') {
      window.open(item.url, '_system');
      return;
    }
    this.amplitudeService.track('report:media:opened', {});

    if (item.type == 'image') {
      this.modalCtrl
        .create({
          component: ImageViewComponent,
          componentProps: {
            image: this.backendService.buildUrl(`/upload/${item._id}`),
          },
          cssClass: 'transparent-modal',
        })
        .then((modal) => {
          modal.present();
        });
      return;
    }

    if (item.type == 'youtube' || item.type == 'youtubeshorts') {
      this.modalCtrl
        .create({
          component: YoutubeViewComponent,
          componentProps: {
            videoId: item.filename,
          },
          cssClass: 'transparent-modal',
        })
        .then((modal) => {
          modal.present();
        });
      return;
    }

    if (item.type == 'video') {
      this.modalCtrl
        .create({
          component: VideoViewComponent,
          componentProps: {
            filename: item.filename,
            id: item._id,
          },
          cssClass: 'transparent-modal',
        })
        .then((modal) => {
          modal.present();
        });
      return;
    }

    this.reportMediaService.select(item);
  }

  getThumbnailUrl(media: any) {
    if (media.type == 'image') {
      return this.backendService.buildUrl(`/upload/thumb/${media._id}`);
    } else {
      return `https://video.ufosightings.app/uploads/screenshot/${media._id}?api_key=a8w9dzahAa8d`;
    }
  }
}
