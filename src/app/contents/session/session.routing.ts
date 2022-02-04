import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import {NoPageComponent} from './no-page/no-page.component';

export const SessionRoute: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { title : 'login.login' },
      },
     {
        path: 'error/:type',
        component: ErrorComponent,
        data: { title : 'error.no-page-msg2' },
      },
      {
        path: 'error',
        component: NoPageComponent,
        data: { title : 'error.no-page' },
      }
    ]
  }
];
