import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Gallery } from '../../../../../ufosightings-app-gallery-plugin';
import { Platform, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-upload-media',
  templateUrl: './upload-media.component.html',
  styleUrls: ['./upload-media.component.scss'],
})
export class UploadMediaComponent implements OnInit {
  @Output() filesChange = new EventEmitter<any>();
  @Output() uploadChange = new EventEmitter<any>();
  files: any = [];
  uploadingVideo: boolean = false;
  uploadingImage: boolean = false;
  webUploadRunning: boolean = false;
  response: any = '';
  error: any = '';
  isWeb: boolean = false;
  isApp: boolean = false;

  constructor(
    public platform: Platform,
    private http: HttpClient,
    private toastController: ToastController,
    private translocoService: TranslocoService
  ) {
    if (
      (this.platform.is('android') || this.platform.is('ios')) &&
      !this.platform.is('mobileweb')
    ) {
      this.isApp = true;
    } else {
      this.isWeb = true;
    }
  }

  ngOnInit() {}

  async selectVideo() {
    this.uploadingVideo = true;
    this.uploadChange.emit(true);
    let result: any = null;
    try {
      result = await Gallery.getMedia({
        allowPictures: false,
        allowVideos: true,
      });

      if (typeof result.response != 'undefined') {
        result = result.response;
      }

      if (typeof result._id == 'undefined') {
        this.uploadingVideo = false;
        this.uploadChange.emit(false);
        this.showError();
        return;
      }
      result.type = 'video';
      this.addFile(result);
      this.uploadingVideo = false;
      this.uploadChange.emit(false);
    } catch (error: any) {
      this.uploadingVideo = false;
      this.uploadChange.emit(false);
      if (error.messages.toLowerCase().indexOf('canceled')) {
        return;
      }
      this.showError();
    }
  }

  async selectImage() {
    this.uploadingImage = true;
    this.uploadChange.emit(true);
    let result: any = null;
    try {
      result = await Gallery.getMedia({
        allowPictures: true,
        allowVideos: false,
      });

      if (typeof result.response != 'undefined') {
        result = result.response;
      }

      if (typeof result._id == 'undefined') {
        this.uploadingImage = false;
        this.uploadChange.emit(false);
        this.showError();
        return;
      }

      result.type = 'image';
      this.addFile(result);

      this.uploadingImage = false;
      this.uploadChange.emit(false);
    } catch (error: any) {
      this.uploadingImage = false;
      this.uploadChange.emit(false);
      if (error.messages.toLowerCase().indexOf('canceled')) {
        return;
      }
      this.showError();
    }
  }

  async onWebSelectChange(event: any) {
    let file = event.target.files[0];
    // check if it is a video or image:
    let url = '';
    let fieldName = '';
    let type = '';
    if (file.type.includes('image')) {
      url = 'https://api.ufosightings.app/upload?api_key=a8w9dzahAa8d';
      fieldName = 'files';
      type = 'image';
    } else if (file.type.includes('video')) {
      fieldName = 'videoFile';
      url = 'https://video.ufosightings.app/uploads?api_key=a8w9dzahAa8d';
      type = 'video';
    } else {
      this.showError();
      return;
    }

    // Upload file
    this.webUploadRunning = true;
    this.uploadChange.emit(true);
    const formData = new FormData();
    formData.append(fieldName, file, file.name);
    const upload$ = this.http.post(url, formData);
    upload$.subscribe({
      next: (response: any) => {
        if (typeof response.length != 'undefined') {
          response = response[0];
        }
        this.webUploadRunning = false;
        this.uploadChange.emit(false);
        response.type = type;
        this.addFile(response);
      },
      error: (error: any) => {
        this.webUploadRunning = false;
        this.uploadChange.emit(false);
        this.showError();
      },
    });
  }

  removeFile(file: any) {
    this.files = this.files.filter((f: any) => f !== file);
    this.filesChange.emit(this.files);
  }

  addFile(file: any) {
    this.files.push(file);
    this.filesChange.emit(this.files);
  }

  generateUrl(file: any) {
    if (file.type == 'image') {
      return `https://api.ufosightings.app/upload/${file._id}?api_key=a8w9dzahAa8d`;
    } else {
      return `https://video.ufosightings.app/uploads/screenshot/${file._id}?api_key=a8w9dzahAa8d`;
    }
  }

  showError() {
    this.toastController
      .create({
        message: this.translocoService.translate('uploadmedia.toasts.error'),
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      })
      .then((toastHandler) => {
        toastHandler.present();
      });
  }
}
