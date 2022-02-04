import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 알림 관리
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService extends RestClient {

  static URL = class {
    /**
     * 이력 목록 조회
     */
    static readonly SEARCH_HISTORY_LIST: string = '/sms-history';

    /**
     * 고객 목록 조회
     */
    static readonly SEARCH_MEMBER_LIST: string = '/send-sms/search-member';

    /**
     * 발송그룹 목록 조회
     */
    static readonly SEARCH_GROUP_LIST: string = '/send-sms/search-group-target';

    /**
     * 광고처 목록 조회
     */
    static readonly SEARCH_PARTNER_LIST: string = '/send-sms/search-partner';
  };

  /**
   * 발송 uri 접두사
   *
   * @private
   */
  private sendPrepend: string = 'send-sms';

  /**
   * 이력 uri 접두사
   *
   * @private
   */
  private histPrepend: string = 'sms-history';


  constructor(http: HttpClient) {
    super('', http);
  }

  /**
   * sms 발송
   *
   * @param entity
   */
  sendSms(entity: any): Observable<any> {
    return this.post(entity, this.sendPrepend);
  }

  /**
   * sms 발송 관련 코드 조회
   */
  searchSendSmsCodes(): Observable<any> {
    return this.get([this.sendPrepend, 'search-codes'].join('/'));
  }

  /**
   * sms 발송대상 그룹 조회
   */
  searchSendSmsGroup(): Observable<any> {
    return this.get([this.sendPrepend, 'search-group-target'].join('/'));
  }

  /**
   * sms 발송대상 회원 조회
   */
  searchSendSmsMember(): Observable<any> {
    return this.get([this.sendPrepend, 'search-member'].join('/'));
  }

  /**
   * sms 발송대상 광고처 조회
   */
  searchSendSmsPartner(params?: any): Observable<any> {
    return this.get([this.sendPrepend, 'search-partner'].join('/'), params);
  }

  /**
   * sms 재발송
   *
   * @param seq
   */
  resendSms(seq: number): Observable<any> {
    return this.put({}, [this.histPrepend, 're-send', seq].join('/'));
  }

  /**
   * sms 이력 관련 코드 조회
   */
  searchHistSmsCodes(): Observable<any> {
    return this.get([this.histPrepend, 'search-codes'].join('/'));
  }
}
