import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class PageGuard implements CanActivate {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{

    // 페이지 이동하면 spinner 모두 hide
    // this.spinner.hide('full');
    this.spinner.hide('main');

    return true;
  }

}
