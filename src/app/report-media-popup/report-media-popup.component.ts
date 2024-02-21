import { Component, OnInit } from '@angular/core';
import { ReportMediaService } from '../report-media.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-report-media-popup',
  templateUrl: './report-media-popup.component.html',
  styleUrls: ['./report-media-popup.component.scss'],
})
export class ReportMediaPopupComponent implements OnInit {
  selected: any = null;
  apiLoaded: boolean = false;

  imageUrl: string = '';

  ytHeight: number = 315;

  constructor(
    public reportMediaService: ReportMediaService,
    private backendService: BackendService
  ) {
    this.reportMediaService.selectedChanged.subscribe((item: any) => {
      this.selected = item;
      if (this.selected?.type == 'image') {
        this.imageUrl = this.backendService.buildUrl(
          `/upload/${this.selected._id}`
        );
      }
    });
  }

  getContentWidth() {
    return (
      (document.querySelector('app-info-window, .app-info-window') as any)
        .offsetWidth * 0.8
    );
  }

  getContentHeight() {
    return (
      (document.querySelector('app-info-window, .app-info-window') as any)
        .offsetHeight * 0.8
    );
  }

  ngOnInit() {
    if (this.apiLoaded == false) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  close() {
    this.reportMediaService.select(null);
  }
}
