import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 광고심사 관리
 */
@Injectable({
  providedIn: 'root'
})
export class AdvJudgeService extends RestClient {

  static URL = class {
    /**
     * 목록 조회
     */
    static readonly SEARCH_LIST  : string = '/advAudit';
  };

  constructor(http: HttpClient) {
    super('/advAudit', http);
  }

  /**
   * 광고심사 조회
   *
   * @param seq
   */
  search(seq: number): Observable<any> {
    return this.get([seq].join(''));
  }

  /**
   * 광고심사 등록
   *
   * @param entity
   */
  register(entity: any): Observable<any> {
    return this.post(entity);
  }

  /**
   * 광고심사 수정
   *
   * @param entity
   */
  modify(entity: any): Observable<any> {
    return this.put(entity, entity.seq);
  }

  /**
   * 광고심사 상태 변경 및 수정
   *
   * @param entity
   */
  modifyAudit(entity: any): Observable<any> {
    return this.put(entity, ['audit', entity.seq].join('/'));
  }

  /**
   * 결제 취소
   *
   * @param seq
   * @param memberId
   */
  cancelPayment(seq: number, memberId: string): Observable<any> {
    return this.put({}, ['cancel', seq, memberId].join('/'));
  }

  /**
   * 광고심사 관련 코드 목록 조회
   */
  searchCodes(): Observable<any> {
    return this.get('search-codes');
  }
}
