import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonComponent} from "../../../common-component";
import {BundlePurchaseService} from "../../../../service/purchase-bundle/bundle-purchase.service";

@Component({
  selector: 'app-signupcoupon-mng',
  templateUrl: './signupcoupon-mng.component.html',
  styleUrls: ['./signupcoupon-mng.component.scss']
})
export class SignupcouponMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
    couponUsableCode: []
  };

  promotion: any = {};

  constructor(private purchaseService: BundlePurchaseService) {
    super();

    this.purchaseService.searchPromotionCodes().subscribe((res) => {
      this.selectLists.couponUsableCode = res.couponUsableCode.map((item) => {
        return { name: item.name, value: item.val == 1 };
      });

      this.selectLists.memberCouponCode = res.memberCouponCode.map((item) => {
        return { name: item.name, value: item.code };
      });
    });
  }

  ngOnInit(): void {
  }

  /**
   * 프로모션 등록 or 수정
   */
  savePromotion(): void {
    if ('MCT002' != this.promotion.memberCouponCode) {
      this.promotion.memberCouponExpiredDay = undefined;
    }

    this.purchaseService.registerPromotionMemberCoupon(this.promotion).subscribe((res) => {
      this.movePromotionList('N');
    });
  }

  /**
   * 프로모션 목록 메뉴로 이동
   */
  movePromotionList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 초기화
   */
  public init(): void {
    this.purchaseService.searchPromotionMemberCoupon().subscribe((res) => {
      this.promotion = res;

      this.promotion.discountType  = this.promotion.discountType || 'PDT001';
      this.promotion.discountPrice = this.promotion.discountPrice || 0;
      this.promotion.usable = this.promotion.usable || false;
    });
  }
}
