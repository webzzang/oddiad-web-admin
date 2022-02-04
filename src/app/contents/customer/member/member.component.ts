import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {MemberListComponent} from "./member-list/member-list.component";
import {MemberMngComponent} from "./member-mng/member-mng.component";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  static readonly PATH : string = 'customer/member';

  @ViewChild('memberList') memberList : MemberListComponent;
  @ViewChild('memberMng')  memberMng  : MemberMngComponent;

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
      this.memberList.refresh();
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
      this.memberMng.init(id);
    });
  }
}
