import {Injectable} from '@angular/core';
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * 상품 관리
 */
@Injectable({
  providedIn: 'root'
})
export class PurchaseService extends RestClient {

  constructor(http: HttpClient) {
    super('/product', http);
  }

  private oddiConfigUrl = 'config/od-zone/';
  private subwayConfigUrl = 'config/subway/';

  /**
   * 오디존 설정 조회
   */
  searchOddizoneConfig(): Observable<any> {
    return this.get('config/oddi-zone');
  }

  /**
   * 지하철 설정 조회
   */
  searchSubwayzoneConfig(): Observable<any> {
    return this.get('config/subway');
  }

  /**
   * 오디존 설정 사용 코드 조회
   */
  searchCodes(): Observable<any> {
    return this.get('config/oddi-zone/search-codes');
  }

  /**
   * 오디존 광고 신청취소 가능일 저장
   */
  modifyOddiZoneAdvCancelDate(entity: any): Observable<any> {
    return this.put(entity, [this.oddiConfigUrl + "adv-cancel-date",entity.oddiAdvCancelDate].join('/'));
  }

  /**
   * 오디존 최장 광고기간 저장
   */
  modifyOddiZoneOddiAdvMaxDate(entity: any): Observable<any> {
    return this.put(entity, [this.oddiConfigUrl + "adv-max-date",entity.oddiAdvMaxDate].join('/'));
  }

  /**
   * 오디존 광고 시작 가능일 저장
   */
  modifyOddiZoneAdvStartDate(entity: any): Observable<any> {
    return this.put(entity, [this.oddiConfigUrl + "adv-start",entity.oddiAdvFromStartDate, entity.oddiAdvToStartDate].join('/'));
  }

  /**
   * 오디존 기본광고 저장
   */
  modifyOddiZoneDefaultAdv(entity: any): Observable<any> {
    return this.put(entity, this.oddiConfigUrl + "defaultAdv");
  }

  /**
   * 오디존 디자인 제작 요청여부 저장
   */
  modifyOddiZoneDesignRequest(entity: any): Observable<any> {
    return this.put(entity, [this.oddiConfigUrl + "design-request",entity.designRequest].join('/'));
  }

  /**
   * 오디존 화면분할 저장
   */
  modifyOddiZoneDisplayDiv(entity: any): Observable<any> {
    return this.put(entity, [this.oddiConfigUrl + "displayDiv",entity.displayDiv,entity.sideDisplayServiceCode].join('/'));
  }

  /**
   * 오디존 설정 기기당 슬롯수 저장
   */
  modifyOddiZoneSlotCount(entity: any): Observable<any> {
    return this.put(entity, [this.oddiConfigUrl + "slot-count",entity.slotCount].join('/'));
  }

  /**
   *오디존 설정 기기당 슬롯수 저장
   */
  modifyOddiZoneSlotVideoTime(entity: any): Observable<any> {
    return this.put(entity, [this.oddiConfigUrl + "slot-video-time",entity.slotVideoTime].join('/'));
  }


  // 지하철
  /**
   * 지하철 광고 신청취소 가능일 저장
   */
  modifySubwayAdvCancelDate(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "adv-cancel-date",entity.subwayAdvCancelDate].join('/'));
  }

  /**
   * 지하철 최대광고 시작일 마감일 저장
   */
  modifySubwayAdvMaxDate(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "adv-max-date",entity.subwayAdvMaxDate].join('/'));
  }

  /**
   * 지하철 익월 광고 신청 마감일 저장
   */
  modifySubwaySubwayAdvLastDate(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "adv-last-date",entity.subwayAdvLastDate].join('/'));
  }

  /**
   * 지하철 최대광고 시작일 마감일 저장
   */
  modifySubwayAdvMaxStartDate(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "/adv-max-start-date",entity.subwayAdvMaxStartDate].join('/'));
  }

  /**
   * 지하철 디자인 제작 요청여부 저장
   */
  modifySubwayDesignRequest(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "design-request",entity.designRequest].join('/'));
  }

  /**
   * 지하철 운영시간 저장
   */
  modifySubwayOperationTime(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "operation-time",entity.operationStartTime,entity.operationEndTime].join('/'));
  }

  /**
   * 지하철 광고 설정 기기당 슬롯수 저장
   */
  modifySubwaySlotCount(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "slot-count",entity.slotCount].join('/'));
  }

  /**
   * 지하철 광고 설정 슬롯당 노출시간 저장
   */
  modifySubwaySlotVideoTime(entity: any): Observable<any> {
    return this.put(entity, [this.subwayConfigUrl + "slot-video-time",entity.slotVideoTime].join('/'));
  }


}
