import { Component, OnInit } from '@angular/core';
import { StreamService } from '../stream.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-reports-stream-actions',
  templateUrl: './reports-stream-actions.component.html',
  styleUrls: ['./reports-stream-actions.component.scss'],
})
export class ReportsStreamActionsComponent implements OnInit {
  sort = 'hot';
  country = 'all';
  countries: any = [];

  constructor(
    public streamService: StreamService,
    private backend: BackendService
  ) {}

  ngOnInit() {
    this.streamService.bodyReloaded.subscribe((value) => {
      this.restore();
    });

    this.backend.getJSON('/spots/countries').subscribe((data) => {
      this.countries = data.map((country: any) => {
        return country.name;
      });
      this.countries = this.countries.sort();
    });
    this.restore();
  }

  restore() {
    if (typeof this.streamService.body.sort['scoring.hot'] != 'undefined') {
      this.sort = 'hot';
    }

    if (
      typeof this.streamService.body.sort['creationTimeUnix'] != 'undefined'
    ) {
      this.sort = 'latest';
    }

    if (typeof this.streamService.body.sort['receivedAtUnix'] != 'undefined') {
      this.sort = 'recent';
    }

    if (typeof this.streamService.body.query['spot.country'] != 'undefined') {
      this.country = this.streamService.body.query['spot.country'];
    }
  }

  changeSorting(event: any) {
    if (event.detail.value == 'hot') {
      this.streamService.body.sort = {
        'scoring.hot': -1,
      };
    }

    if (event.detail.value == 'latest') {
      this.streamService.body.sort = {
        creationTimeUnix: -1,
      };
    }

    if (event.detail.value == 'recent') {
      this.streamService.body.sort = {
        receivedAtUnix: -1,
      };
    }

    this.streamService.clearStream();
    this.streamService.getStream();
  }

  changeCountry(event: any) {
    if (event.detail.value == 'all') {
      this.streamService.body.query = {};
    } else {
      this.streamService.body.query = {
        'spot.country': event.detail.value,
      };
    }

    this.streamService.clearStream();
    this.streamService.getStream();
  }
}
