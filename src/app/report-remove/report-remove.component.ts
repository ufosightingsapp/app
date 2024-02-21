import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../user.service';
import { BackendService } from '../backend.service';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-report-remove',
  templateUrl: './report-remove.component.html',
  styleUrls: ['./report-remove.component.scss'],
})
export class ReportRemoveComponent implements OnInit {
  @Input() authorId: string;
  @Input() reportId: string;
  @Output() refresh = new EventEmitter<any>();

  myId: string;

  constructor(
    private userService: UserService,
    private backendService: BackendService,
    private toastController: ToastController,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    this.userService.get('authorId').then((userId) => {
      this.myId = userId;
    });
  }

  remove() {
    if (
      this.authorId == this.myId &&
      confirm(this.translocoService.translate('reportremove.confirm'))
    ) {
      this.backendService
        .getJSON(`/reports/remove/${this.reportId}?authorId=${this.authorId}`)
        .subscribe(async (data) => {
          this.refresh.emit();
        });
      this.userService.removeReport(this.reportId);
    }
  }
}
