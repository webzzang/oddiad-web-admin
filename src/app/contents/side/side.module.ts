import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftComponent } from './left/left.component';
import { TopComponent } from './top/top.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ContentTopComponent } from './content-top/content-top.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    RouterModule
  ],
  declarations: [
    TopComponent,
    LeftComponent,
    ContentTopComponent
  ],
  entryComponents: [
    TopComponent,
    LeftComponent,
    ContentTopComponent
  ],
  exports: [
    TopComponent,
    LeftComponent,
    ContentTopComponent
  ]
})
export class SideModule { }
