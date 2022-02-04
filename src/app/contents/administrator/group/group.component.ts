import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {GroupMngComponent} from "./group-mng/group-mng.component";
import {GroupListComponent} from "./group-list/group-list.component";

/**
 * 관리자 그룹
 */
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  static readonly PATH: string = 'admin/group';

  @ViewChild('groupList') groupList: GroupListComponent;
  @ViewChild('groupMng')  groupMng : GroupMngComponent;

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
   * 관리자 그룹정보 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.groupList.refresh();
    }
  }

  /**
   * 관리자 그룹정보 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.groupMng.init(seq);
    });
  }

}
