import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {SitetopbannerListComponent} from "./sitetopbanner-list/sitetopbanner-list.component";
import {SitetopbannerMngComponent} from "./sitetopbanner-mng/sitetopbanner-mng.component";

/**
 * 사이트 상단배너
 */
@Component({
  selector: 'app-sitetopbanner',
  templateUrl: './sitetopbanner.component.html',
  styleUrls: ['./sitetopbanner.component.scss']
})
export class SitetopbannerComponent implements OnInit {

  static readonly PATH : string = 'advertisement/content/sitetopbanner';

  @ViewChild('sitetopbannerList') sitetopbannerList: SitetopbannerListComponent;
  @ViewChild('sitetopbannerMng')  sitetopbannerMng : SitetopbannerMngComponent;

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
   * 상단배너정보 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.sitetopbannerList.refresh();
    }
  }

  /**
   * 상단배너정보 목록측의 화면전환 이벤트 핸들러
   *
   * @param id
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.sitetopbannerMng.init(seq);
    });
  }
}
