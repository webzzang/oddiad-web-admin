import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {MarketingListComponent} from "./marketing-list/marketing-list.component";
import {MarketingMngComponent} from "./marketing-mng/marketing-mng.component";

/**
 * 개인정보 마케팅이용 수집 및 동의 약관
 */
@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
})
export class MarketingComponent implements OnInit {

  static readonly PATH: string = 'clause/marketing';

  @ViewChild('marketingList') marketingList: MarketingListComponent;
  @ViewChild('marketingMng')  marketingMng : MarketingMngComponent;

  /**
   * 페이지 분류
   */
  pageType = PageType;

  /**
   * 활성화 페이지 분류
   */
  activePageType: PageType = PageType.LIST;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * 마케팅 약관 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.marketingList.refresh();
    }
  }

  /**
   * 마케팅 약관 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.marketingMng.init(seq);
    });
  }
}
