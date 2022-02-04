import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 매출
 */
@Injectable({
  providedIn: 'root'
})
export class SalesService extends RestClient {

  static URL = class {
    /**
     * 광고내역 목록 조회
     */
    static readonly SEARCH_ADV_HISTORY_LIST: string = '/adv-history';

    /**
     * 결제내역 목록 조회
     */
    static readonly SEARCH_PAYMENT_HISTORY_LIST: string = '/payment-history';
  };

  constructor(http: HttpClient) {
    super('', http);
  }

  /**
   * 광고관련 코드 조회
   */
  searchAdvHistoryCodes(): Observable<any> {
    return this.get('adv-history/search-codes');
  }

  /**
   * 결제내역 목록 건수 조회
   *
   * @param params
   */
  searchPaymentListCount(params: any): Observable<any> {
    return this.get('payment-history-count', params);
  }

  /**
   * 결제내역 목록 조회
   *
   * @param params
   */
  searchPaymentList(params: any): Observable<any> {
    return this.get('payment-history', params);
  }

  /**
   * 결제 취소
   */
  cancelPayment(paymentSeq: number, advSeq: number): Observable<any> {
    return this.put({}, ['payment-history/cancel', paymentSeq, advSeq].join('/'));
  }

  /**
   * 결제관련 코드 조회
   */
  searchPaymentHistoryCodes(): Observable<any> {
    return this.get('payment-history/search-codes');
  }
}
