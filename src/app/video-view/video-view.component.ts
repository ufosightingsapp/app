import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-video-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss'],
})
export class VideoViewComponent implements OnInit {
  @Input() filename: any;
  @Input() id: any;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  getWidth() {
    return (window as any).document.querySelector('.video-container')
      .offsetWidth;
  }

  getHeight() {
    return (
      (window as any).document.querySelector('.video-container').offsetHeight *
      0.9
    );
  }

  getThumbnailUrl() {
    return `https://video.ufosightings.app/uploads/screenshot/${this.id}?api_key=a8w9dzahAa8d`;
  }

  getStreamUrl() {
    return `https://video.ufosightings.app/uploads/stream/${this.filename}?api_key=a8w9dzahAa8d`;
  }
}
