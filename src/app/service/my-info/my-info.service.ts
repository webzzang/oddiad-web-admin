import {Injectable} from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 내정보 관리
 */
@Injectable({
  providedIn: 'root'
})
export class MyInfoService extends RestClient {

  constructor(http: HttpClient) {
    super('/my', http);
  }

  /**
   * 현재 사용자 계정정보 조회
   */
  searchAccount(): Observable<any> {
    return this.get('');
  }

  /**
   * 현재 사용자 계정정보 수정
   *
   * @param entity
   */
  modifyAccount(entity: any): Observable<any> {
    return this.put(entity);
  }

  /**
   * 현재 유저의 접근 가능 메뉴 조회
   */
  searchMenuList(): Observable<any> {
    return this.get('menu');
  }

  /**
   * 현재 사용자 비밀번호 수정
   *
   * @param oldPassword
   * @param newPassword
   */
  modifyPassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.put({oldPassword, newPassword}, 'password');
  }

  /**
   * 현재 사용자 비밀번호 사용기간 연장
   */
  modifyPasswordPeriod(): Observable<any> {
    return this.put({}, 'password/extension');
  }
}
