import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../domain/vo/page-type.enum";
import {TermsService} from "../../service/terms/terms.service";
import {EnvironmentListComponent} from "./environment-list/environment-list.component";
import {EnvironmentMngComponent} from "./environment-mng/environment-mng.component";

/**
 * 기기
 */
@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent implements OnInit {

  static readonly PATH: string = 'environment';

  @ViewChild('environmentList') environmentList: EnvironmentListComponent;
  @ViewChild('environmentMng')  environmentMng : EnvironmentMngComponent;

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
   * 기기 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.environmentList.refresh();
    }
  }

  /**
   * 기기 목록측의 화면전환 이벤트 핸들러
   *
   * @param deviceId
   */
  moveMngEventHandler(deviceId: string) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.environmentMng.init(deviceId);
    });
  }
}
