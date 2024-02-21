import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { AmplitudeService } from '../amplitude.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-report-vote',
  templateUrl: './report-vote.component.html',
  styleUrls: ['./report-vote.component.scss'],
})
export class ReportVoteComponent implements OnInit {
  @Input() report: any;
  hasVoted: boolean = false;
  myAuthorId: string = '';

  constructor(
    private reportService: ReportService,
    private amplitudeService: AmplitudeService,
    private userService: UserService
  ) {
    this.userService.get('authorId').then((userId) => {
      this.myAuthorId = userId;
    });
  }

  async ngOnInit() {
    if (typeof this.report.votes == 'undefined') {
      this.report.votes = {
        positive: 0,
        negative: 0,
        total: 0,
      };
    }
    this.hasVoted = await this.reportService.hasVoted(this.report._id);
  }

  async up() {
    this.hasVoted = true;
    this.report.votes.positive += 1;
    await this.reportService.upvote(this.report._id);
    this.amplitudeService.track('report:upvoted', {});
  }

  async down() {
    this.hasVoted = true;
    this.report.votes.negative += 1;
    await this.reportService.downvote(this.report._id);
    this.amplitudeService.track('report:downvoted', {});
  }

  showVoteButtons(): boolean {
    if (
      this.myAuthorId != null &&
      typeof this.report.authorIdentifier != 'undefined' &&
      this.myAuthorId == this.report.authorIdentifier
    )
      this.hasVoted = true;
    return true;
  }
}
