import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {EnvrightbannerListComponent} from "./envrightbanner-list/envrightbanner-list.component";
import {EnvrightbannerMngComponent} from "./envrightbanner-mng/envrightbanner-mng.component";

/**
 * 우측 배너
 */
@Component({
  selector: 'app-envrightbanner',
  templateUrl: './envrightbanner.component.html',
  styleUrls: ['./envrightbanner.component.scss']
})
export class EnvrightbannerComponent implements OnInit {

  static readonly PATH : string = 'advertisement/content/envrightbanner';

  @ViewChild('envrightbannerList') envrightbannerList: EnvrightbannerListComponent;
  @ViewChild('envrightbannerMng')  envrightbannerMng : EnvrightbannerMngComponent;

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
   * 우측배너정보 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.envrightbannerList.refresh();
    }
  }

  /**
   * 우측배너정보 목록측의 화면전환 이벤트 핸들러
   *
   * @param id
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.envrightbannerMng.init(seq);
    });
  }
}
