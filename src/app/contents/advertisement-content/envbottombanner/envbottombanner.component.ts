import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {EnvbottombannerListComponent} from "./envbottombanner-list/envbottombanner-list.component";
import {EnvbottombannerMngComponent} from "./envbottombanner-mng/envbottombanner-mng.component";

/**
 * 하단배너
 */
@Component({
  selector: 'app-envbottombanner',
  templateUrl: './envbottombanner.component.html',
  styleUrls: ['./envbottombanner.component.scss']
})
export class EnvbottombannerComponent implements OnInit {

  static readonly PATH : string = 'advertisement/content/envbottombanner';

  @ViewChild('envbottombannerList') envbottombannerList: EnvbottombannerListComponent;
  @ViewChild('envbottombannerMng')  envbottombannerMng : EnvbottombannerMngComponent;

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
      this.envbottombannerList.refresh();
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
      this.envbottombannerMng.init(seq);
    });
  }
}
