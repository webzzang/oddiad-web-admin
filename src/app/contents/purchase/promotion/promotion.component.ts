import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {TermsService} from "../../../service/terms/terms.service";
import {PromotionListComponent} from "./promotion-list/promotion-list.component";
import {PromotionMngComponent} from "./promotion-mng/promotion-mng.component";
import {SignupcouponMngComponent} from "./signupcoupon-mng/signupcoupon-mng.component";

/**
 * 프로모션 관리
 */
@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  static readonly PATH: string = 'purchase/promotion';

  @ViewChild('promotionList') promotionList: PromotionListComponent;
  @ViewChild('promotionMng')  promotionMng : PromotionMngComponent;
  @ViewChild('signupcouponMng') signupcouponMng: SignupcouponMngComponent

  /**
   * 페이지 분류
   */
  pageType = PageType;

  /**
   * 활성화 페이지 분류
   */
  activePageType: PageType = PageType.LIST;

  constructor(protected termsService: TermsService) { }

  ngOnInit(): void {
  }

  /**
   * 기기 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.promotionList.refresh();
    }
  }

  /**
   * 기기 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  movePromotionMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.promotionMng.init(seq);
    });
  }

  /**
   * 기기 목록측의 화면전환 이벤트 핸들러
   */
  moveSignupMngEventHandler() : void {
    this.activePageType = PageType.FORM2;

    setTimeout(() => {
      this.signupcouponMng.init();
    });
  }
}
