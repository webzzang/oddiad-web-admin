import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {TermsService} from "../../../service/terms/terms.service";
import {PlanListComponent} from "./plan-list/plan-list.component";
import {PlanMngComponent} from "./plan-mng/plan-mng.component";

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  static readonly PATH : string = 'advertisement/plan';

  @ViewChild('planList') planList: PlanListComponent;
  @ViewChild('planMng')  planMng : PlanMngComponent;

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
   * 광고편성 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.planList.refresh();
    }
  }

  /**
   * 광고편성 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.planMng.init(seq);
    });
  }
}
