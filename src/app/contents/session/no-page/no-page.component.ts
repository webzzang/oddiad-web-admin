import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-no-page',
  templateUrl: './no-page.component.html',
  styleUrls: ['./no-page.component.scss']
})
export class NoPageComponent {

  constructor(private translate: TranslateService, private router: Router) {}

  goMain() {
    this.router.navigate(["/"], { replaceUrl: true });
  }
}
