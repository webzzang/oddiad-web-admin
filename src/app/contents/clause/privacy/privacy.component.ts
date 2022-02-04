import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {PrivacyListComponent} from "./privacy-list/privacy-list.component";
import {PrivacyMngComponent} from "./privacy-mng/privacy-mng.component";

/**
 * 개인정보 처리방침 약관
 */
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  static readonly PATH: string = 'clause/privacy';

  @ViewChild('privacyList') privacyList: PrivacyListComponent;
  @ViewChild('privacyMng')  privacyMng : PrivacyMngComponent;

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
   * 개인정보 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.privacyList.refresh();
    }
  }

  /**
   * 개인정보 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.privacyMng.init(seq);
    });
  }
}
