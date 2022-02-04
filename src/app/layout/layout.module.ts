import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleLayoutComponent } from './SimpleLayout/SimpleLayout.component';
import { BlankLayoutComponent } from './BlankLayout/BlankLayout.component';
import { RouterModule } from '@angular/router';
import { SideModule } from '../contents/side/side.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SideModule,
    NgxSpinnerModule
  ],
  declarations: [
    SimpleLayoutComponent,
    BlankLayoutComponent
  ],
  entryComponents: [
    SimpleLayoutComponent,
    BlankLayoutComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LayoutModule { }
