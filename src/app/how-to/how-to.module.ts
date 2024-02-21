import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowToPageRoutingModule } from './how-to-routing.module';

import { HowToPage } from './how-to.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowToPageRoutingModule,
    SharedModule,
  ],
  declarations: [HowToPage],
})
export class HowToPageModule {}
