import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {RestClient} from "../../shared/http/rest-client";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BundlePurchaseService extends RestClient {

  static URL = class {
    /**
     * 묶음상품 목록 조회
     */
    static readonly SEARCH_PRODUCT_BUNDLE_LIST: string = '/product/bundle';

    /**
     * 광고처 목록 조회
     */
    static readonly SEARCH_PARTNER_LIST: string = '/product/bundle/search-partner';

    /**
     * 프로모션 목록 조회
     */
    static readonly SEARCH_PROMOTION_LIST: string = '/promotion';

    /**
     * 쿠폰 목록 조회
     */
    static readonly SEARCH_COUPON_LIST: string = '/promotion/coupon';
  };

  constructor(http: HttpClient) {
    super('', http);
  }

  /**
   * 묶음상품 등록
   *
   * @param entity
   */
  registerBundleProduct(entity: any): Observable<any> {
    return this.post(entity, 'product/bundle');
  }

  /**
   * 묶음상품 수정
   *
   * @param entity
   */
  modifyBundleProduct(entity: any): Observable<any> {
    return this.put(entity, ['product/bundle', entity.seq].join('/'));
  }

  /**
   * 묶음상품 단건 조회
   *
   * @param seq
   */
  searchBundleProduct(seq: number): Observable<any> {
    return this.get(['product/bundle', seq].join('/'));
  }

  /**
   * 묶음상품 관련 코드 조회
   */
  searchBundleProductCodes(): Observable<any> {
    return this.get('product/bundle/search-codes');
  }

  /**
   * 프로모션 등록
   *
   * @param entity
   */
  registerPromotion(entity: any): Observable<any> {
    return this.post(entity, 'promotion');
  }

  /**
   * 프로모션 단건 조회
   *
   * @param seq
   */
  searchPromotion(seq: number): Observable<any> {
    return this.get(['promotion', seq].join('/'));
  }

  /**
   * 프로모션 수정
   *
   * @param entity
   */
  modifyPromotion(entity: any): Observable<any> {
    return this.put(entity, ['promotion', entity.seq].join('/'));
  }

  /**
   * 프로모션 쿠폰 건수 조회
   *
   * @param params
   */
  searchPromotionCouponCount(params: any): Observable<any> {
    return this.get('promotion/coupon-count', params);
  }

  /**
   * 프로모션 쿠폰 목록 조회
   *
   * @param params
   */
  searchPromotionCouponList(params: any): Observable<any> {
    return this.get('promotion/coupon', params);
  }

  /**
   * 프로모션 등록 쿠폰발행
   */
  registerPromotionCoupon(entity: any): Observable<any> {
    return this.post(entity, ['promotion/coupon', entity.seq].join('/'));
  }

  /**
   * 프로모션 수정 쿠폰발행
   *
   * @param entity
   */
  modifyPromotionCoupon(entity: any): Observable<any> {
    return this.post(entity, ['promotion/coupon', entity.seq].join('/'));
  }

  /**
   * 가입자 쿠폰정보 조회
   */
  searchPromotionMemberCoupon(): Observable<any> {
    return this.get('promotion/member/coupon');
  }

  /**
   * 가입자 쿠폰정보 등록
   *
   * @param entity
   */
  registerPromotionMemberCoupon(entity: any): Observable<any> {
    return this.post(entity, 'promotion/member/coupon');
  }

  /**
   * 프로모션 관련 코드 조회
   */
  searchPromotionCodes(): Observable<any> {
    return this.get('promotion/search-codes');
  }
}
