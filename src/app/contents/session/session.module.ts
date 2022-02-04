import {NgxSpinnerModule} from 'ngx-spinner';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SessionRoute} from './session.routing';
import {ErrorComponent} from './error/error.component';
import {LoginComponent} from './login/login.component';
import {SessionService} from './session.service';
import {MatDialogModule} from '@angular/material/dialog';
import {NoPageComponent} from './no-page/no-page.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule.forRoot(),
    RouterModule.forChild(SessionRoute),
    TranslateModule,
    NgxSpinnerModule
  ],
  declarations: [
    ErrorComponent,
    LoginComponent,
    NoPageComponent,
  ],
  entryComponents: [
    ErrorComponent,
    LoginComponent,
    NoPageComponent,
  ],
  providers: [
    SessionService
  ]
})
export class SessionModule { }
