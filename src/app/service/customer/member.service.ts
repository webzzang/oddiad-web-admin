import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MemberService extends RestClient {

  static URL = class {
    /**
     * 목록 조회
     */
    static readonly SEARCH_LIST  : string = '/member';
  };

  constructor(http: HttpClient) {
    super('/member', http);
  }

  /**
   * 고객정보 조회
   *
   * @param id
   */
  search(id: string): Observable<any> {
    return this.get(id);
  }

  /**
   * 고객정보 수정
   *
   * @param entity
   */
  modify(entity: any): Observable<any> {
    return this.put(entity, entity.id);
  }

  /**
   * 고객정보 관련 코드 목록 조회
   */
  searchCodes(): Observable<any> {
    return this.get('search-codes');
  }
}
