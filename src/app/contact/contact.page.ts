import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  public email: string = '';
  public message: string = '';
  public subject: string = '';
  public loading: boolean = false;

  constructor(
    public httpService: BackendService,
    private modalCtrl: ModalController,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  public changeEmail(event: any) {
    this.email = event.target.value;
  }

  public changeSubject(event: any) {
    this.subject = event.target.value;
  }

  public changeMessage(event: any) {
    this.message = event.target.value;
  }

  public sendEmail(): boolean {
    if (
      typeof this.email == 'undefined' ||
      this.email == '' ||
      this.email == null
    ) {
      alert(this.translocoService.translate('contact.alerts.invalid_email'));
      return false;
    }

    if (
      typeof this.subject == 'undefined' ||
      this.subject == '' ||
      this.subject == null
    ) {
      alert(this.translocoService.translate('contact.alerts.invalid_subject'));
      return false;
    }

    if (
      typeof this.message == 'undefined' ||
      this.message == '' ||
      this.message == null
    ) {
      alert(this.translocoService.translate('contact.alerts.invalid_message'));
      return false;
    }

    this.loading = true;
    this.httpService
      .post(
        '/contact',
        {
          email: this.email,
          subject: this.subject,
          message: this.message,
        },
        null
      )
      .subscribe(
        (data) => {
          this.loading = false;
          alert(
            this.translocoService.translate('contact.alerts.submit_success')
          );
          this.email = '';
          this.subject = '';
          this.message = '';
        },
        (error) => {
          this.loading = false;
          alert(this.translocoService.translate('contact.alerts.submit_error'));
        }
      );
    return true;
  }
}
