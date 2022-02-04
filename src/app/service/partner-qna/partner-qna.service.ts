import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 파트너 QNA 관리
 */
@Injectable({
  providedIn: 'root'
})
export class PartnerQnaService extends RestClient {

  static URL = class {
    /**
     * 목록 조회
     */
    static readonly SEARCH_LIST  : string = '/partner-request';
  };
  
  constructor(http: HttpClient) {
    super('/partner-request', http);
  }

  /**
   * 파트너 QNA 조회
   *
   * @param seq
   */
  search(seq: number): Observable<any> {
    return this.get([seq].join(''));
  }

  /**
   * 파트너 QNA 등록
   *
   * @param entity
   */
  register(entity: any): Observable<any> {
    return this.post(entity);
  }

  /**
   * 파트너 QNA 수정
   *
   * @param entity
   */
  modify(entity: any): Observable<any> {
    return this.put(entity, entity.seq);
  }

  /**
   * 파트너 QNA 관련 코드 목록 조회
   */
  searchCodes(): Observable<any> {
    return this.get('search-codes');
  }
}
