import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { UsageService } from './usage.service';
import { SharedModule } from './shared.module';
import { UpdaterService } from './updater.service';

import { LocalNotificationsService } from './local-notification.service';
import { FcmService } from './fcm.service';
import { ModalHolderService } from './modal-holder.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { StreamService } from './stream.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    UpdaterService,
    UsageService,
    LocalNotificationsService,
    FcmService,
    ModalHolderService,
    StreamService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
