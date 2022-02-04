import { Injectable } from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 기기
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService extends RestClient {

  static URL = class {
    /**
     * 기기 목록 조회
     */
    static readonly SEARCH_DEVICE_LIST : string = '/device';

    static readonly SEARCH_HISTORY_LIST: string = '/device/history';
  };

  constructor(http: HttpClient) {
    super('/device', http);
  }

  /**
   * 기기 상세정보 조회
   *
   * @param deviceId
   */
  search(deviceId: string): Observable<any> {
    return this.get(['info', deviceId].join('/'));
  }

  /**
   * 기기관련 코드 조회
   */
  searchCodes(): Observable<any> {
    return this.get('search-codes');
  }
}
