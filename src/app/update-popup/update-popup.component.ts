import { Component, OnInit } from '@angular/core';
import { UpdaterService } from '../updater.service';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrls: ['./update-popup.component.scss'],
})
export class UpdatePopupComponent implements OnInit {
  constructor(private updaterService: UpdaterService) {}

  ngOnInit() {}

  openStore() {
    window.open(this.updaterService.STORE_URL, '_system');
  }
}
