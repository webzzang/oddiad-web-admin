import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {SitepopupListComponent} from "./sitepopup-list/sitepopup-list.component";
import {SitepopupMngComponent} from "./sitepopup-mng/sitepopup-mng.component";

/**
 * 사이트 팝업
 */
@Component({
  selector: 'app-sitepopup',
  templateUrl: './sitepopup.component.html',
  styleUrls: ['./sitepopup.component.scss']
})
export class SitepopupComponent implements OnInit {
  
  static readonly PATH : string = 'advertisement/content/sitepopup';

  @ViewChild('sitepopupList') sitepopupList: SitepopupListComponent;
  @ViewChild('sitepopupMng')  sitepopupMng : SitepopupMngComponent;

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
   * 팝업정보 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.sitepopupList.refresh();
    }
  }

  /**
   * 팝업정보 목록측의 화면전환 이벤트 핸들러
   *
   * @param id
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.sitepopupMng.init(seq);
    });
  }
}
