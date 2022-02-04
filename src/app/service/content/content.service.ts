import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentService extends RestClient {

  static URL = class {
    /**
     * 광고처 목록 조회
     */
    static readonly SEARCH_PARTNER_LIST : string = '/live-stream/search-partner';

    /**
     * 광고판 - 우측배너 목록 조회
     */
    static readonly SEARCH_RIGHT_BANNER_LIST : string = '/side-banner/search';

    /**
     * 광고판 - 하단배너 목록 조회
     */
    static readonly SEARCH_BOTTOM_BANNER_LIST : string = '/bottom-banner/search';

    /**
     * 사이트 - 하단배너 목록 조회
     */
    static readonly SEARCH_TOP_BANNER_LIST : string = '/top-banner/search';

    /**
     * 사이트 - 팝업 목록 조회
     */
    static readonly SEARCH_SITE_POPUP_LIST : string = '/site-popup/search';
  };

  constructor(http: HttpClient) {
    super('', http);
  }

  /**
   * 라이브스트림 단건 조회
   */
  searchLivestream(): Observable<any> {
    return this.get('live-stream');
  }

  /**
   * 라이브스트림 정보 수정
   *
   * @param entity
   */
  modifyLivestream(entity: any): Observable<any> {
    return this.put(entity, 'live-stream');
  }

  /**
   * 광고판 - 우측배너 정보 등록
   *
   * @param entity
   */
  registerRightBanner(entity: any): Observable<any> {
    return this.post(entity, 'side-banner');
  }

  /**
   * 광고판 - 우측배너 정보 단건 조회
   */
  searchRightBanner(seq: number): Observable<any> {
    return this.get(['side-banner', seq].join('/'));
  }

  /**
   * 광고판 - 우측배너 정보 수정
   *
   * @param entity
   */
  modifyRightBanner(entity: any): Observable<any> {
    return this.put(entity, ['side-banner', entity.seq].join('/'));
  }

  /**
   * 광고판 - 우측배너 관련 코드 조회
   */
  searchRightBannerCodes(): Observable<any> {
    return this.get('side-banner/search-codes');
  }

  /**
   * 광고판 - 하단배너 정보 등록
   *
   * @param entity
   */
  registerBottomBanner(entity: any): Observable<any> {
    return this.post(entity, 'bottom-banner');
  }

  /**
   * 광고판 - 하단배너 정보 단건 조회
   */
  searchBottomBanner(seq: number): Observable<any> {
    return this.get(['bottom-banner', seq].join('/'));
  }

  /**
   * 광고판 - 하단배너 정보 수정
   *
   * @param entity
   */
  modifyBottomBanner(entity: any): Observable<any> {
    return this.put(entity, ['bottom-banner', entity.seq].join('/'));
  }

  /**
   * 광고판 - 하단배너 관련 코드 조회
   */
  searchBottomBannerCodes(): Observable<any> {
    return this.get('bottom-banner/search-codes');
  }

  /**
   * 사이트 - 탑배너 정보 등록
   *
   * @param entity
   */
  registerTopBanner(entity: any): Observable<any> {
    return this.post(entity, 'top-banner');
  }

  /**
   * 사이트 - 탑배너 정보 단건 조회
   */
  searchTopBanner(seq: number): Observable<any> {
    return this.get(['top-banner', seq].join('/'));
  }

  /**
   * 사이트 - 탑배너 정보 수정
   *
   * @param entity
   */
  modifyTopBanner(entity: any): Observable<any> {
    return this.put(entity, ['top-banner', entity.seq].join('/'));
  }

  /**
   * 사이트 - 탑배너 관련 코드 조회
   */
  searchTopBannerCodes(): Observable<any> {
    return this.get('top-banner/search-codes');
  }

  /**
   * 사이트 - 팝업 정보 등록
   *
   * @param entity
   */
  registerPopup(entity: any): Observable<any> {
    return this.post(entity, 'site-popup');
  }

  /**
   * 사이트 - 팝업 정보 단건 조회
   */
  searchPopup(seq: number): Observable<any> {
    return this.get(['site-popup', seq].join('/'));
  }

  /**
   * 사이트 - 팝업 정보 수정
   *
   * @param entity
   */
  modifyPopup(entity: any): Observable<any> {
    return this.put(entity, ['site-popup', entity.seq].join('/'));
  }

  /**
   * 사이트 - 팝업 관련 코드 조회
   */
  searchPopupCodes(): Observable<any> {
    return this.get('site-popup/search-codes');
  }
  
}
