import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 관리자 그룹 관리
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGroupService extends RestClient {

  static URL = class {
    /**
     * 목록 조회
     */
    static readonly SEARCH_LIST  : string = '/manager/role';
  };

  constructor(http: HttpClient) {
    super('/manager/role', http);
  }

  /**
   * 관리자 그룹 조회
   *
   * @param seq
   */
  search(seq: number): Observable<any> {
    return this.get([seq].join(''));
  }

  /**
   * 관리자 그룹 디폴트 값으로 조회
   */
  searchDefault(): Observable<any> {
    return this.get('init-info');
  }

  /**
   * 관리자 그룹 등록
   *
   * @param entity
   */
  register(entity: any): Observable<any> {
    return this.post(entity);
  }

  /**
   * 관리자 그룹 수정
   *
   * @param entity
   */
  modify(entity: any): Observable<any> {
    return this.put(entity, entity.seq);
  }
}
