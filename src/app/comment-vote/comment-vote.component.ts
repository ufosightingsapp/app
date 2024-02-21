import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AmplitudeService } from '../amplitude.service';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-comment-vote',
  templateUrl: './comment-vote.component.html',
  styleUrls: ['./comment-vote.component.scss'],
})
export class CommentVoteComponent implements OnInit {
  @Input() comment: any;
  hasVoted: boolean = false;
  myAuthorId: string = '';

  constructor(
    private commentService: CommentService,
    private amplitudeService: AmplitudeService,
    private userService: UserService
  ) {
    this.userService.get('authorId').then((userId) => {
      this.myAuthorId = userId;
    });
  }

  async ngOnInit() {
    if (typeof this.comment.votes == 'undefined') {
      this.comment.votes = {
        positive: 0,
        negative: 0,
        total: 0,
      };
    }
    this.hasVoted = await this.commentService.hasVoted(this.comment._id);
    if (
      this.myAuthorId != null &&
      typeof this.comment.authorIdentifier != 'undefined' &&
      this.myAuthorId == this.comment.authorIdentifier
    ) {
      this.hasVoted = true;
    }
  }

  async up() {
    this.hasVoted = true;
    this.comment.votes.positive += 1;
    await this.commentService.upvote(this.comment._id);
    this.amplitudeService.track('comment:upvoted', {});
  }

  async down() {
    this.hasVoted = true;
    this.comment.votes.negative += 1;
    await this.commentService.downvote(this.comment._id);
    this.amplitudeService.track('comment:downvoted', {});
  }
}
