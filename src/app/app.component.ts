import {Component} from '@angular/core';
import {NavigationService} from './shared/service/navigation.service';
import {TranslateService} from '@ngx-translate/core';
import {LocationStrategy} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '오디-관리자사이트';

  constructor(public translate: TranslateService,
    public navigationService: NavigationService,
    private _router: Router,
    private locationStrategy: LocationStrategy) {

    this.navigationService.loadRouting();
    this.locationStrategy.onPopState(() => {
      this.navigationService.isBackClicked = true;
      return false;
    });

    this._router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this._router.navigated = false;
        window.scrollTo(0, 0);
      }
    });

    this.navigationService.loadRouting();
    this.locationStrategy.onPopState(() => {
      this.navigationService.isBackClicked = true;
      return false;
    });
  }

  ngOnInit() {
    sessionStorage.setItem("selectParentMenuId", null);
    sessionStorage.setItem("selectMenuId", null);
  }
}
