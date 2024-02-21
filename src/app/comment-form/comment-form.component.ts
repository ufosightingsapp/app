import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from '../backend.service';
import { AlertController, ToastController } from '@ionic/angular';
import { UserService } from '../user.service';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements OnInit {
  @Input() report: any;
  @Input() parentId: string = '';
  @Output() refresh = new EventEmitter<any>();
  submitted: boolean = false;

  extendedInput: boolean = false;
  message: string = '';

  files: any = [];
  uploadRunning = false;

  constructor(
    private backendService: BackendService,
    private alertController: AlertController,
    private toastController: ToastController,
    private userService: UserService,
    private deviceService: DeviceService
  ) {}

  ngOnInit() {}

  sendComment() {
    let comment = this.message;
    let words = comment.split(' ');
    if (comment.length == 0 || words.length < 3) {
      this.alertController
        .create({
          header: 'Comment too short',
          message: 'Please enter at least 3 words.',
          buttons: ['OK'],
          cssClass: 'custom-alert-wrapper',
        })
        .then((alert) => alert.present());
      return;
    }

    if (this.uploadRunning) {
      this.alertController
        .create({
          header: 'Upload in progress',
          message: 'Please wait until the upload is finished.',
          buttons: ['OK'],
          cssClass: 'custom-alert-wrapper',
        })
        .then((alert) => alert.present());
      return;
    }

    let data: any = {
      message: comment,
      report: this.report,
      authorIdentifier: this.deviceService.id,
    };

    if (this.files.length >= 1) {
      data.media = this.files;
    }

    if (this.parentId != '') {
      data.parentId = this.parentId;
    }

    this.backendService
      .post(`/reports/comments/${this.report._id}/insert`, data, null)
      .subscribe((data) => {
        this.submitted = true;
        this.refresh.emit();
        if (typeof data.authorIdentifier != 'undefined') {
          this.userService.set('authorId', data.authorIdentifier);
        }
        this.message = '';
        let toast = this.toastController.create({
          message: 'Comment added.',
          duration: 2000,
        });
        toast.then((toast) => toast.present());
      });
  }

  onMessageChange(event: any) {
    this.message = event.target.value;
  }

  onFilesChange(event: any) {
    this.files = event;
  }

  onUploadChange(event: any) {
    this.uploadRunning = event;
  }

  getInputRows() {
    if (this.extendedInput) {
      return 3;
    }

    return 1;
  }
}
