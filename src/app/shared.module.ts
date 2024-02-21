import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NavigationToggleComponent } from './navigation-toggle/navigation-toggle.component';

import { HttpClientModule } from '@angular/common/http';
import { BackendService } from './backend.service';
import { ReportMediaService } from './report-media.service';
import { MarkerHolderService } from './marker-holder.service';
import { ReportService } from './report.service';
import { SpotService } from './spot.service';
import { MapFilterService } from './map-filter.service';

import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule } from '@ionic/angular';

import { MediaListComponent } from './media-list/media-list.component';
import { ReportVoteComponent } from './report-vote/report-vote.component';
import { ReportMediaPopupComponent } from './report-media-popup/report-media-popup.component';
import { CommentsComponent } from './comments/comments.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { AmplitudeService } from './amplitude.service';
import { DeviceService } from './device.service';
import { UserService } from './user.service';
import { ReportComponent } from './report/report.component';
import { ReportRemoveComponent } from './report-remove/report-remove.component';
import { PushrequestComponent } from './pushrequest/pushrequest.component';
import { CommentVoteComponent } from './comment-vote/comment-vote.component';
import { FcmService } from './fcm.service';
import { CommentService } from './comment.service';
import { UpdatePopupComponent } from './update-popup/update-popup.component';
import { ModalHolderService } from './modal-holder.service';
import { ConnectionService } from './connection.service';
import { ImageViewComponent } from './image-view/image-view.component';
import { YoutubeViewComponent } from './youtube-view/youtube-view.component';
import { App } from '@capacitor/app';
import { AppPopupComponent } from './app-popup/app-popup.component';
import { ReportsStreamPage } from './reports-stream/reports-stream.page';
import { FilterPage } from './filter/filter.page';
import { PrivacyPolicyPage } from './privacy-policy/privacy-policy.page';
import { HowToPage } from './how-to/how-to.page';
import { ContactPage } from './contact/contact.page';
import { MapPage } from './map/map.page';
import { SpotInfoComponent } from './spot-info/spot-info.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { InfoWindowComponent } from './map/info-window/info-window.component';
import { ReportFormWindowComponent } from './map/report-form-window/report-form-window.component';
import { GuideComponent } from './map/guide/guide.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationStorageService } from './notification-storage.service';
import { NotificationToggleComponent } from './notification-toggle/notification-toggle.component';
import { MyreportsComponent } from './myreports/myreports.component';
import { UploadMediaComponent } from './upload-media/upload-media.component';
import { VideoViewComponent } from './video-view/video-view.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ReportsStreamActionsComponent } from './reports-stream-actions/reports-stream-actions.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__appdb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
    IonicModule,
    YouTubePlayerModule,
    TranslocoModule,
  ],
  declarations: [
    NavigationToggleComponent,
    MediaListComponent,
    ReportVoteComponent,
    ReportMediaPopupComponent,
    ReportRemoveComponent,
    PushrequestComponent,
    CommentsComponent,
    CommentVoteComponent,
    CommentFormComponent,
    CommentComponent,
    ReportComponent,
    UpdatePopupComponent,
    ImageViewComponent,
    YoutubeViewComponent,
    AppPopupComponent,
    ReportsStreamPage,
    FilterPage,
    PrivacyPolicyPage,
    HowToPage,
    ContactPage,
    MapPage,
    SpotInfoComponent,
    ReportFormComponent,
    InfoWindowComponent,
    ReportFormWindowComponent,
    GuideComponent,
    NotificationsComponent,
    NotificationToggleComponent,
    MyreportsComponent,
    UploadMediaComponent,
    VideoViewComponent,
    ReportsStreamActionsComponent,
  ],
  exports: [
    NavigationToggleComponent,
    CommonModule,
    FormsModule,
    MediaListComponent,
    ReportVoteComponent,
    ReportMediaPopupComponent,
    ReportRemoveComponent,
    PushrequestComponent,
    CommentsComponent,
    CommentVoteComponent,
    CommentFormComponent,
    CommentComponent,
    ReportComponent,
    UpdatePopupComponent,
    ImageViewComponent,
    YoutubeViewComponent,
    AppPopupComponent,
    ReportsStreamPage,
    FilterPage,
    PrivacyPolicyPage,
    HowToPage,
    ContactPage,
    MapPage,
    SpotInfoComponent,
    ReportFormComponent,
    InfoWindowComponent,
    ReportFormWindowComponent,
    GuideComponent,
    NotificationsComponent,
    NotificationToggleComponent,
    MyreportsComponent,
    UploadMediaComponent,
    VideoViewComponent,
    ReportsStreamActionsComponent,
  ],
  providers: [
    BackendService,
    ReportMediaService,
    MarkerHolderService,
    ReportService,
    SpotService,
    MapFilterService,
    AmplitudeService,
    DeviceService,
    UserService,
    FcmService,
    CommentService,
    ModalHolderService,
    ConnectionService,
    NotificationStorageService,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
