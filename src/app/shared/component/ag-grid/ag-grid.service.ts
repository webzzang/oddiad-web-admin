import { RestClient } from './../../http/rest-client';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgGridService extends RestClient {

  constructor(protected http: HttpClient) {
    super('', http);
  }

  private subject = new Subject<any>();
  subject$ = this.subject.asObservable();

  getList(path: string, params: any): Observable<any> {
    return this.get(path, params);
  }

  call(sortData) {
    this.subject.next(sortData);
  }

}
