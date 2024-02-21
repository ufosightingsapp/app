import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ModalController } from '@ionic/angular';
import { SpotService } from '../spot.service';
import { StreamService } from '../stream.service';

@Component({
  selector: 'app-reports-stream',
  templateUrl: './reports-stream.page.html',
  styleUrls: ['./reports-stream.page.scss'],
})
export class ReportsStreamPage implements OnInit {
  @Input() public navigate: any;
  showBackToTopButton: boolean = false;

  constructor(
    private backendService: BackendService,
    private modalCtrl: ModalController,
    public streamService: StreamService
  ) {}

  ngOnInit() {}

  formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  public async refresh(event: any) {
    this.streamService.setLimit(5);
    this.streamService.setSkip(0);
    this.streamService.clearStream();
    await this.streamService.getStream();
    event.target.complete();
  }

  public async openMap(spotId: string) {
    this.modalCtrl.dismiss();
    this.navigate(spotId);
  }

  async onIonInfinite(event: any) {
    this.streamService.setSkip(this.streamService.body.skip + 5);
    await this.streamService.getStream();
    event.target.complete();
  }

  onStreamScroll(event: any) {
    if (event.detail.scrollTop > 400) {
      this.showBackToTopButton = true;
    } else {
      this.showBackToTopButton = false;
    }
  }

  scrollTop() {
    (document as any)?.getElementById('stream')?.scrollToTop();
    this.showBackToTopButton = false;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
