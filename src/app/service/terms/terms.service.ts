import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestClient} from "../../shared/http/rest-client";
import {Observable} from "rxjs";

/**
 * 약관 관리
 */
@Injectable({
  providedIn: 'root'
})
export class TermsService extends RestClient {

  /**
   * 약관 상태 코드
   */
  static readonly STATUS = class {
    static readonly TEMP : string = 'TST001';

    static readonly USE : string = 'TST002';

    static readonly DISCARD : string = 'TST003';
  };

  static readonly URL = class {
    /**
     * 서비스 이용 약관 목록 조회
     */
    static readonly SEARCH_SERVICE_LIST  : string = '/terms/service';

    /**
     * 개인정보 처리 약관 목록 조회
     */
    static readonly SEARCH_PRIVACY_LIST  : string = '/terms/privacy';

    /**
     * 제3자 정보 제공 약관 목록 조회
     */
    static readonly SEARCH_PROVIDE_LIST  : string = '/terms/provide';

    /**
     * 개인정보 마케팅 약관 목록 조회
     */
    static readonly SEARCH_MARKETING_LIST  : string = '/terms/marketing';

    /**
     * 광고 신청 약관 목록 조회
     */
    static readonly SEARCH_ADV_LIST  : string = '/terms/adv';
  };

  constructor(http: HttpClient) {
    super('/terms', http);
  }

  /**
   * 서비스 약관 조회
   *
   * @param seq
   */
  searchServiceTerms(seq: number) : Observable<any> {
    return this.get(['service', seq].join('/'));
  }

  /**
   * 서비스 약관 등록
   *
   * @param entity
   */
  registerServiceTerms(entity: any) : Observable<any> {
    return this.post(entity, 'service');
  }

  /**
   * 서비스 약관 수정
   *
   * @param entity
   */
  modifyServiceTerms(entity: any) : Observable<any> {
    return this.put(entity, ['service', entity.seq].join('/'));
  }

  /**
   * 서비스 약관 폐기
   *
   * @param seq
   */
  modifyServiceTermsStatusToGarbage(seq: number) : Observable<any> {
    return this.put({}, ['service/garbage', seq].join('/'));
  }

  /**
   * 개인정보 약관 조회
   *
   * @param seq
   */
  searchPrivacyTerms(seq: number) : Observable<any> {
    return this.get(['privacy', seq].join('/'));
  }

  /**
   * 개인정보 약관 등록
   *
   * @param entity
   */
  registerPrivacyTerms(entity: any) : Observable<any> {
    return this.post(entity, 'privacy');
  }

  /**
   * 개인정보 약관 수정
   *
   * @param entity
   */
  modifyPrivacyTerms(entity: any) : Observable<any> {
    return this.put(entity, ['privacy', entity.seq].join('/'));
  }

  /**
   * 개인정보 약관 폐기
   *
   * @param seq
   */
  modifyPrivacyTermsStatusToGarbage(seq: number) : Observable<any> {
    return this.put({}, ['privacy/garbage', seq].join('/'));
  }

  /**
   * 정보제공 약관 조회
   *
   * @param seq
   */
  searchProvideTerms(seq: number) : Observable<any> {
    return this.get(['provide', seq].join('/'));
  }

  /**
   * 정보제공 약관 등록
   *
   * @param entity
   */
  registerProvideTerms(entity: any) : Observable<any> {
    return this.post(entity, 'provide');
  }

  /**
   * 정보제공 약관 수정
   *
   * @param entity
   */
  modifyProvideTerms(entity: any) : Observable<any> {
    return this.put(entity, ['provide', entity.seq].join('/'));
  }

  /**
   * 정보제공 약관 폐기
   *
   * @param seq
   */
  modifyProvideTermsStatusToGarbage(seq: number) : Observable<any> {
    return this.put({}, ['provide/garbage', seq].join('/'));
  }

  /**
   * 마케팅 약관 조회
   *
   * @param seq
   */
  searchMarketingTerms(seq: number) : Observable<any> {
    return this.get(['marketing', seq].join('/'));
  }

  /**
   * 마케팅 약관 등록
   *
   * @param entity
   */
  registerMarketingTerms(entity: any) : Observable<any> {
    return this.post(entity, 'marketing');
  }

  /**
   * 마케팅 약관 수정
   *
   * @param entity
   */
  modifyMarketingTerms(entity: any) : Observable<any> {
    return this.put(entity, ['marketing', entity.seq].join('/'));
  }

  /**
   * 마케팅 약관 폐기
   *
   * @param seq
   */
  modifyMarketingTermsStatusToGarbage(seq: number) : Observable<any> {
    return this.put({}, ['marketing/garbage', seq].join('/'));
  }

  /**
   * 광고신청 약관 조회
   *
   * @param seq
   */
  searchAdvTerms(seq: number) : Observable<any> {
    return this.get(['adv', seq].join('/'));
  }

  /**
   * 광고신청 약관 등록
   *
   * @param entity
   */
  registerAdvTerms(entity: any) : Observable<any> {
    return this.post(entity, 'adv');
  }

  /**
   * 광고신청 약관 수정
   *
   * @param entity
   */
  modifyAdvTerms(entity: any) : Observable<any> {
    return this.put(entity, ['adv', entity.seq].join('/'));
  }

  /**
   * 광고신청 약관 폐기
   *
   * @param seq
   */
  modifyAdvTermsStatusToGarbage(seq: number) : Observable<any> {
    return this.put({}, ['adv/garbage', seq].join('/'));
  }
}
