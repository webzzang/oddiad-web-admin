import {Injectable} from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 관리자 계정 관리
 */
@Injectable({
  providedIn: 'root'
})
export class AdminAccountService extends RestClient {

  static URL = class {
    /**
     * 목록 조회
     */
    static readonly SEARCH_LIST  : string = '/account';
  };

  constructor(protected http : HttpClient) {
    super('/account', http);
  }

  /**
   * 관리자 계정 조회
   *
   * @param id
   */
  search = (id: string) : Observable<any> => {
    return this.get(id);
  }

  /**
   * 관리자 계정 등록
   *
   * @param entity
   */
  register(entity: any) : Observable<any> {
    return this.post(entity);
  }

  /**
   * 관리자 계정 수정
   *
   * @param entity
   */
  modify(entity: any) : Observable<any> {
    return this.put(entity, entity.id);
  }

  /**
   * 관리자 계정 목록 조회
   *
   * @param condition
   */
  searchList(condition: any) : Observable<any> {
    return this.get('', condition);
  }

  /**
   * 관리자 관련 코드 묶음 조회
   */
  searchCodes() : Observable<any> {
    return this.get('codes');
  }

  /**
   * 관리자 계정 비밀번호 초기화
   *
   * @param id
   * @param password
   */
  resetPassword(id: string) : Observable<any> {
    return this.put({}, [id, 'password-init'].join('/'));
  }
}
