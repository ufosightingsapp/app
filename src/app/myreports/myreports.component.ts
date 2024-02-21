import { Component, Input, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ModalController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-myreports',
  templateUrl: './myreports.component.html',
  styleUrls: ['./myreports.component.scss'],
})
export class MyreportsComponent implements OnInit {
  @Input() public navigate: any;

  public reports: any = {
    myreports: [],
    bookmarked: [],
  };
  public loading: boolean = true;
  public type: string = 'myreports';

  constructor(
    private backendService: BackendService,
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  setType(type: string) {
    this.type = type;
    if (this.reports[this.type].length == 0) {
      this.loadReports();
    }
  }

  formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  public async loadReports() {
    this.reports['myreports'] = await this.userService.getReports();
    this.reports['bookmarked'] = await this.userService.getBookmarks();
    this.loading = false;
  }

  public getReports() {
    return this.reports[this.type];
  }

  public async refresh(event: any) {
    await this.loadReports();
    event.target.complete();
  }

  public async openMap(spotId: string) {
    this.modalCtrl.dismiss();
    this.navigate(spotId);
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
