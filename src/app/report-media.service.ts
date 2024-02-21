import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportMediaService {
  selected: any = null;
  public selectedChanged: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.selectedChanged.subscribe((value: any) => {
      this.selected = value;
    });
  }

  select(item: any) {
    this.selectedChanged.next(item);
  }
}
