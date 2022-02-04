import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  id: string;
  pwd: string;

  constructor(private router: Router,
              private route: ActivatedRoute) {
    this.route.queryParams.subscribe((queryParams) => {
      this.id=queryParams['id']; // get the values of your queryParams
      this.pwd=queryParams['pwd'];
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{
   
    //return true;
     if (sessionStorage.getItem('accesstoken')) {
       return true;
     } else {
      this.router.navigate(['/session/login'],{queryParams : {id: this.id , pwd: this.pwd }, replaceUrl: true});
       return false;
     }
  }

}
