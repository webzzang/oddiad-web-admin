import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 공지사항 관리
 */
@Injectable({
  providedIn: 'root'
})
export class NoticeService extends RestClient {

  static URL = class {
    /**
     * 목록 조회
     */
    static readonly SEARCH_LIST  : string = '/notice';
  };
  
  constructor(http: HttpClient) { 
    super('/notice', http);
  }

  /**
   * 공지사항 조회
   *
   * @param seq
   */
  search(seq: number): Observable<any> {
    return this.get([seq].join(''));
  }

  /**
   * 공지사항 등록
   *
   * @param entity
   */
  register(entity: any): Observable<any> {
    return this.post(entity);
  }

  /**
   * 공지사항 수정
   *
   * @param entity
   */
  modify(entity: any): Observable<any> {
    return this.put(entity, entity.seq);
  }

  /**
   * 공지사항 관련 코드 목록 조회
   */
  searchCodes(): Observable<any> {
    return this.get('search-codes');
  }
}
