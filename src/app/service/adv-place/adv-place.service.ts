import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 광고처 관리
 */
@Injectable({
  providedIn: 'root'
})
export class AdvPlaceService extends RestClient {

  static URL = class {
    /**
     * 오디존 목록 조회
     */
    static readonly SEARCH_ODDIZONE_LIST : string = '/partner/oddi-zone';

    /**
     * 지하철 목록 조회
     */
    static readonly SEARCH_SUBWAYZONE_LIST : string = '/partner/subway' 
  };

  constructor(http: HttpClient) {
    super('/partner', http);
  }

  /**
   * 오디존 조회
   *
   * @param seq
   */
  searchOddiZone(seq: number): Observable<any> {
    return this.get(['oddi-zone', seq].join('/'));
  }

  /**
   * 오디존 등록
   *
   * @param entity
   */
  registerOddiZone(entity: any): Observable<any> {
    return this.post(entity, 'oddi-zone');
  }

  /**
   * 오디존 수정
   *
   * @param entity
   */
  modifyOddiZone(entity: any): Observable<any> {
    return this.put(entity, ['oddi-zone', entity.seq].join('/'))
  }

  /**
   * 오디존 관련 코드 정보 조회
   */
  searchOddiZoneCodes(): Observable<any> {
    return this.get(['oddi-zone', 'codes'].join('/'));
  }

  /**
   * 지하철 조회
   *
   * @param seq
   */
  searchSubwayZone(seq: number): Observable<any> {
    return this.get(['subway', seq].join('/'));
  }

  /**
   * 지하철 등록
   *
   * @param entity
   */
  registerSubwayZone(entity: any): Observable<any> {
    return this.post(entity, 'subway');
  }

  /**
   * 지하철 수정
   *
   * @param entity
   */
  modifySubwayZone(entity: any): Observable<any> {
    return this.put(entity, ['subway', entity.seq].join('/'))
  }

  /**
   * 지하철 기본설정 조회
   */
  searchSubwayZoneDefaultConfig(): Observable<any> {
    return this.get('subway/config');
  }

  /**
   * 지하철 관련 코드 정보 조회
   */
  searchSubwayZoneCodes(): Observable<any> {
    return this.get(['subway', 'codes'].join('/'));
  }
  
}
