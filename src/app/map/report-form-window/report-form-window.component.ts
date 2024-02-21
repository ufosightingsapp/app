import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-report-form-window',
  templateUrl: './report-form-window.component.html',
  styleUrls: ['./report-form-window.component.scss'],
})
export class ReportFormWindowComponent implements OnInit {
  @Input() info: any;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }
}
