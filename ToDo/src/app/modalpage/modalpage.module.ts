import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalpagePageRoutingModule } from './modalpage-routing.module';

import { ModalpagePage } from './modalpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalpagePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ModalpagePage, ReactiveFormsModule],
})
export class ModalpagePageModule {}
