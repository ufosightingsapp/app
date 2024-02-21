import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Share } from '@capacitor/share';
import { UserService } from '../user.service';
import moment from 'moment';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  @Input() report: any;
  @Input() ogimage: any;
  @Output() refresh = new EventEmitter<any>();
  @ViewChild('reportBody') reportBody: ElementRef<any>;
  isBookmarked = false;
  showComments = false;
  userLanguage = 'en';
  translating = false;
  translated = false;

  constructor(
    private userService: UserService,
    private backend: BackendService
  ) {}

  ngOnInit() {
    this.userService.isBookmarked(this.report._id).then((isBookmarked) => {
      this.isBookmarked = isBookmarked;
    });

    this.userService.get('deviceLanguage').then((language) => {
      this.userLanguage = language;
      this.report.text = this.getText();
      if (
        typeof this.report.language != 'undefined' &&
        this.report.language == this.userLanguage
      ) {
        this.translated = true;
      }
    });
  }

  getText() {
    if (
      typeof this.report.translations !== 'undefined' &&
      typeof this.report.translations[this.userLanguage] !== 'undefined'
    ) {
      this.translated = true;
      return this.report.translations[this.userLanguage];
    }
    return this.report.text;
  }

  formatText(text: string) {
    if (typeof text !== 'string') {
      return text;
    }
    text = text.replace('\n', '<br />');
    text = text.replace(
      /(https:\/\/[^\s]+)/gi,
      '<a href="$1" class="in-app-browser" target="_blank">$1</a>'
    );
    return text;
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

  removeRefresh() {
    this.refresh.emit();
  }

  async share() {
    await Share.share({
      url: `https://ufosightings.app/sighting/${this.report._id}`,
    });
  }

  getOgImageUrl() {
    return `https://api.ufosightings.app/reports/ogimage/${this.report._id}?api_key=a8w9dzahAa8d`;
  }

  bookmark() {
    if (this.isBookmarked) {
      this.userService.removeBookmark(this.report._id);
      this.isBookmarked = false;
      return;
    }
    this.userService.addBookmark(this.report);
    this.isBookmarked = true;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  getCommentsCount() {
    if (!this.report.comments) {
      return 0;
    }
    return this.report.comments;
  }

  translate() {
    this.translating = true;
    this.backend
      .getText(`/reports/translate/${this.report._id}/${this.userLanguage}`)
      .subscribe((data) => {
        this.report.text = data;
        this.translating = false;
        this.translated = true;
      });
  }
}
