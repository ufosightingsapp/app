import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() report: any;
  @Input() parentId: string = '';
  @Input() comments: any = [];
  @Output() parentRefresh = new EventEmitter<any>();
  loading: boolean = false;

  constructor(private backendService: BackendService) {}

  ngOnInit() {
    if (this.comments.length == 0) this.loadComments();
  }

  hasComments() {
    return this.comments.length > 0;
  }

  loadComments() {
    if (this.parentId != '') {
      this.parentRefresh.emit();
      return;
    }

    this.loading = true;
    this.comments = [];
    this.backendService
      .getJSON(`/reports/comments/${this.report._id}/all`)
      .subscribe((data) => {
        this.comments = data || [];
        this.loading = false;
      });
  }

  refreshComments(event: any) {
    this.loadComments();
    event.target.complete();
  }
}
