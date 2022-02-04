import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {CommonComponent} from "../../../common-component";
import {FaqService} from "../../../../service/faq/faq.service";

/**
 * FAQ 관리
 */
@Component({
  selector: 'app-faq-mng',
  templateUrl: './faq-mng.component.html',
  styleUrls: ['./faq-mng.component.scss']
})
export class FaqMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  seq: number;
  faq : any = {};
  selectLists: any = {
    categoryCode: [],
    expoCode: []
  };

  constructor(protected matDialog: MatDialog,
              protected faqService: FaqService) {
    super();

    this.faqService.searchCodes().subscribe((res) => {
      this.selectLists.categoryCode = res.categoryCode.map((item) => {
        return {name: item.name, value: item.code};
      });

      this.selectLists.expoCode = res.expoCode.map((item) => {
        return {name: item.name, value: parseInt(item.val) ? true : false};
      });
    });
  }

  ngOnInit(): void {
  }

  /**
   * FAQ 등록 or 수정
   */
  saveFaq() : void {
    let ob: Observable<any>;

    if (!this.seq) {
      ob = this.faqService.register(this.faq);
    } else {
      ob = this.faqService.modify(this.faq);
    }

    ob.subscribe((res) => {
      this.moveFaqList('Y');
    });
  }

  /**
   * FAQ 목록 페이지로 이동
   */
  moveFaqList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * FAQ 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;
    this.faq = {};

    if (this.seq) {
      this.faqService.search(this.seq).subscribe((res) => {
        this.faq = res;
      });
    } else {
      if (this.selectLists?.expoCode?.length) {
        this.faq.expo = this.selectLists.expoCode[0].value;
      }

      if (this.selectLists?.categoryCode?.length) {
        this.faq.categoryCode = this.selectLists.categoryCode[0].value;
      }
    }
  }
}
