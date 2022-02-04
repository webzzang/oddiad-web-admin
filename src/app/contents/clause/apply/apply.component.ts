import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {ApplyListComponent} from "./apply-list/apply-list.component";
import {ApplyMngComponent} from "./apply-mng/apply-mng.component";

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  static readonly PATH: string = 'clause/apply';

  @ViewChild('applyList') applyList: ApplyListComponent;
  @ViewChild('applyMng')  applyMng : ApplyMngComponent;

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
   * 광고신청 약관 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.applyList.refresh();
    }
  }

  /**
   * 광고신청 약관 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.applyMng.init(seq);
    });
  }

}
