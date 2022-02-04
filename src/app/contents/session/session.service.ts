import {Injectable} from '@angular/core';
import {RestClient} from '../../shared/http/rest-client';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends RestClient {

  constructor(protected http: HttpClient) {
    super('', http);
    this.defaultHeaders = {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json;charset=utf-8'
    };
    this.setHeader(this.defaultHeaders);
  }

  login(params: { email: string, password: string }): Observable<any> {
    return this.post(params, '/signin');
  }
}
