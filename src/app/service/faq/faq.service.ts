import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * FAQ 관리
 */
@Injectable({
  providedIn: 'root'
})
export class FaqService extends RestClient {

  static URL = class {
    /**
     * 목록 조회
     */
    static readonly SEARCH_LIST  : string = '/faq';
  };

  constructor(http: HttpClient) {
    super('/faq', http);
  }

  /**
   * FAQ 조회
   *
   * @param seq
   */
  search(seq: number): Observable<any> {
    return this.get([seq].join(''));
  }

  /**
   * FAQ 등록
   *
   * @param entity
   */
  register(entity: any): Observable<any> {
    return this.post(entity);
  }

  /**
   * FAQ 수정
   *
   * @param entity
   */
  modify(entity: any): Observable<any> {
    return this.put(entity, entity.seq);
  }

  /**
   * FAQ 관련 코드 목록 조회
   */
  searchCodes(): Observable<any> {
    return this.get('search-codes');
  }
}
