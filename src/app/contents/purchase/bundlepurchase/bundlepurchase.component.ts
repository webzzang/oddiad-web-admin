import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {BundlepurchaseListComponent} from "./bundlepurchase-list/bundlepurchase-list.component";
import {BundlepurchaseMngComponent} from "./bundlepurchase-mng/bundlepurchase-mng.component";

/**
 * 묶음상품
 */
@Component({
  selector: 'app-bundlepurchase',
  templateUrl: './bundlepurchase.component.html',
  styleUrls: ['./bundlepurchase.component.scss']
})
export class BundlepurchaseComponent implements OnInit {

  static readonly PATH : string = 'purchase/bundlepurchase';

  @ViewChild('bundlepurchaseList') bundlepurchaseList: BundlepurchaseListComponent;
  @ViewChild('bundlepurchaseMng')  bundlepurchaseMng : BundlepurchaseMngComponent;

  /**
   * 페이지 분류
   */
  pageType = PageType;

  /**
   * 활성화 페이지 분류
   */
  activePageType: PageType = PageType.LIST;

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * 묶음상품 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.bundlepurchaseList.refresh();
    }
  }

  /**
   * 묶음상품 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.bundlepurchaseMng.init(seq);
    });
  }
}
