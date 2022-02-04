import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {AccountListComponent} from "./account-list/account-list.component";
import {AccountMngComponent} from "./account-mng/account-mng.component";

/**
 * 관리자 계정
 */
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  static readonly PATH: string = 'admin/account';

  @ViewChild('accountList') accountList: AccountListComponent;
  @ViewChild('accountMng')  accountMng : AccountMngComponent;

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
   * 관리자정보 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.accountList.refresh();
    }
  }

  /**
   * 관리자정보 목록측의 화면전환 이벤트 핸들러
   *
   * @param id
   */
  moveMngEventHandler(id: string) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.accountMng.init(id);
    });
  }
}
