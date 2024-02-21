import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-youtube-view',
  templateUrl: './youtube-view.component.html',
  styleUrls: ['./youtube-view.component.scss'],
})
export class YoutubeViewComponent implements OnInit {
  @Input() videoId: any;
  apiLoaded: boolean = false;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.apiLoaded == false) {
      if (document.querySelector('#yt_iframe_api') != null) return;
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.id = 'yt_iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

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
}
