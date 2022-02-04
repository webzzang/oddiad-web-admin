import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 광고편성 관리
 */
@Injectable({
  providedIn: 'root'
})
export class AdvPlanService extends RestClient {

  static URL = class {
    /**
     * 광고편성 목록 조회
     */
    static readonly SEARCH_LIST : string = '/advMake';
  };

  constructor(http: HttpClient) {
    super('/advMake', http);
  }

  /**
   * 광고편성 조회
   *
   * @param seq
   * @param deviceId
   */
  search(seq: number, deviceId: string): Observable<any> {
    return this.get([seq, deviceId].join('/'));
  }

  /**
   * 광고편성 수정
   *
   * @param entity
   */
  modify(entity: any): Observable<any> {
    return this.put(entity, [entity.seq, entity.deviceId || 'null'].join('/'));
  }

  /**
   * 기기 송출
   * 
   * @param deviceId
   */
  sendToEquipment(seq:number, deviceId: string, params: any): Observable<any> {
    return this.post(params, [seq, deviceId || 'null'].join('/'));
  }

  /**
   * 광고편성 관련 코드 정보 조회
   */
  searchCodes(): Observable<any> {
    return this.get('search-codes');
  }
}
