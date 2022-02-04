import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {TermsService} from "../../../service/terms/terms.service";
import {AdvOddizoneListComponent} from "./adv-oddizone-list/adv-oddizone-list.component";
import {AdvOddizoneMngComponent} from "./adv-oddizone-mng/adv-oddizone-mng.component";

/**
 * 광고처 - 오디존 관리
 */
@Component({
  selector: 'app-adv-oddizone',
  templateUrl: './adv-oddizone.component.html',
  styleUrls: ['./adv-oddizone.component.scss']
})
export class AdvOddizoneComponent implements OnInit {

  static readonly PATH: string = 'adv/place/oddizone';

  @ViewChild('advOddizoneList') advOddizoneList: AdvOddizoneListComponent;
  @ViewChild('advOddizoneMng')  advOddizoneMng : AdvOddizoneMngComponent;

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
   * 오디존 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.advOddizoneList.refresh();
    }
  }

  /**
   * 오디존 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.advOddizoneMng.init(seq);
    });
  }
}
