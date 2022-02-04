import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CodeService extends RestClient{

  constructor(http: HttpClient) {
    super('/codes', http);
  }

  /**
   * 코드그룹 목록 조회
   */
  searchCodeGroupList(): Observable<any> {
    return this.get('group');
  }

  /**
   * 코드 목록 조회
   *
   * @param groupCode
   */
  searchCodeList(groupCode: string): Observable<any> {
    return this.get(groupCode);
  }
}
