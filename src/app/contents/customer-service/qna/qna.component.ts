import {Component, OnInit, ViewChild} from '@angular/core';
import {QnaListComponent} from "../qna/qna-list/qna-list.component";
import {QnaMngComponent} from "../qna/qna-mng/qna-mng.component";
import {PageType} from "../../../domain/vo/page-type.enum";
import {TermsService} from "../../../service/terms/terms.service";

/**
 * QNA
 */
@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.scss']
})
export class QnaComponent implements OnInit {

  static readonly PATH: string = 'customer/service/qna';

  @ViewChild('qnaList') qnaList: QnaListComponent;
  @ViewChild('qnaMng')  qnaMng : QnaMngComponent;

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
   * QNA 편집측의 화면전환 이벤트 핸들러
   *
   * @param refreshYn
   */
  moveListEventHandler(refreshYn: string) : void {
    this.activePageType = PageType.LIST;

    if ('Y' == refreshYn) {
      this.qnaList.refresh();
    }
  }

  /**
   * QNA 목록측의 화면전환 이벤트 핸들러
   *
   * @param seq
   */
  moveMngEventHandler(seq: number) : void {
    this.activePageType = PageType.FORM;

    setTimeout(() => {
      this.qnaMng.init(seq);
    });
  }
}
