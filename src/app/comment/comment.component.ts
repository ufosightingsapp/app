import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comment: any;
  @Input() report: any;
  replyTo: string = '';
  @Output() refresh = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  mediaExists() {
    if (
      typeof this.comment.media != 'undefined' &&
      this.comment.media.length > 0
    ) {
      return true;
    }
    return false;
  }

  formatDateTime(dateString: string) {
    // check if the date is from this year
    let momentInstance = moment(dateString);
    if (momentInstance.isSame(new Date(), 'year')) {
      return momentInstance.format('MMM DD [at] h:mm A');
    } else {
      return momentInstance.format('MMM DD, YYYY [at] h:mm A');
    }
  }

  replaceLinks(text: string) {
    return (text = text.replace(
      /(https:\/\/[^\s]+)/gi,
      '<a href="$1" class="in-app-browser" target="_blank">$1</a>'
    ));
  }

  reply() {
    if (this.replyTo == this.comment._id) {
      this.replyTo = '';
      return;
    }
    this.replyTo = this.comment._id;
  }

  hasReplies() {
    return (
      typeof this.comment.replies !== 'undefined' &&
      this.comment.replies.length > 0
    );
  }
}
