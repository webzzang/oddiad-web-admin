import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {TermsService} from "../../../service/terms/terms.service";
import {AdvSubwayzoneListComponent} from "./adv-subwayzone-list/adv-subwayzone-list.component";
import {AdvSubwayzoneMngComponent} from "./adv-subwayzone-mng/adv-subwayzone-mng.component";

/**
 * 광고처 - 지하철 관리
 */
@Component({
  selector: 'app-adv-subwayzone',
  templateUrl: './adv-subwayzone.component.html',
  styleUrls: ['./adv-subwayzone.component.scss']
})
export class AdvSubwayzoneComponent implements OnInit {
  static readonly PATH: string = 'adv/place/subwayzone';

  @ViewChild('advSubwayzoneList') advSubwayzoneList: AdvSubwayzoneListComponent;
  @ViewChild('advSubwayzoneMng')  advSubwayzoneMng : AdvSubwayzoneMngComponent;

  /**
   * 페이지 분류
   */
  pageType = PageType;

  /**
   * 활성화 페이지 분류
   */
  activePageType: PageType = PageType.LIST;

  constructor(protected termsService: TermsService) { }

  ngOnInit(): void {
  }

  /**
   * 지하철 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.advSubwayzoneList.refresh();
    }
  }

  /**
   * 지하철 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.advSubwayzoneMng.init(seq);
    });
  }
}
