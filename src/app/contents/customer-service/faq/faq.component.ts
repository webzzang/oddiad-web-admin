import {Component, OnInit, ViewChild} from '@angular/core';
import {PageType} from "../../../domain/vo/page-type.enum";
import {TermsService} from "../../../service/terms/terms.service";
import {FaqMngComponent} from "./faq-mng/faq-mng.component";
import {FaqListComponent} from "./faq-list/faq-list.component";

/**
 * FAQ 관리
 */
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  static readonly PATH: string = 'customer/service/faq';

  @ViewChild('faqList') faqList: FaqListComponent;
  @ViewChild('faqMng')  faqMng : FaqMngComponent;

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
   * FAQ 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.faqList.refresh();
    }
  }

  /**
   * FAQ 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.faqMng.init(seq);
    });
  }
}
