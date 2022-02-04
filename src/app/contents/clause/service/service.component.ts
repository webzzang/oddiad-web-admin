import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {ServiceListComponent} from "./service-list/service-list.component";
import {ServiceMngComponent} from "./service-mng/service-mng.component";
import {TermsService} from "../../../service/terms/terms.service";

/**
 * 서비스 이용 약관
 */
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  static readonly PATH: string = 'clause/service';

  @ViewChild('serviceList') serviceList: ServiceListComponent;
  @ViewChild('serviceMng')  serviceMng : ServiceMngComponent;

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
   * 서비스 약관 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.serviceList.refresh();
    }
  }

  /**
   * 서비스 약관 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.serviceMng.init(seq);
    });
  }
}
