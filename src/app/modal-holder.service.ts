import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalHolderService {
  modal: any = null;
  blocked: boolean = false;

  constructor() {}

  close() {
    if (this.modal) {
      this.modal.dismiss();
      this.modal = null;
    }
  }

  set(modal: any) {
    this.modal = modal;
  }

  present() {
    if (this.blocked) return;
    if (this.modal) {
      this.modal.present();
      this.blocked = true;
      setTimeout(() => {
        this.blocked = false;
      }, 2000);
    }
  }
}
