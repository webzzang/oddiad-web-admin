import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TermsService} from "../../../../service/terms/terms.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {Observable} from "rxjs";
import {ContentPreviewComponent} from "../../content-preview/content-preview.component";
import {MatDialog} from "@angular/material/dialog";
import {CommonComponent} from "../../../common-component";

@Component({
  selector: 'app-apply-mng',
  templateUrl: './apply-mng.component.html',
  styleUrls: ['./apply-mng.component.scss']
})
export class ApplyMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  readonly clauseStatus : any = TermsService.STATUS;

  seq: number;
  clause : any = {};
  selectLists: any = {
    advTerm: []
  };

  constructor(protected confirmService: ConfirmService,
              protected termsService: TermsService,
              protected matDialog: MatDialog) {
    super();

    this.selectLists.advTerm = [
      { name: '가입 약관', value: false },
      { name: '광고 신청 약관', value: true }
    ];
  }

  ngOnInit(): void {
  }

  /**
   * 광고신청 약관 등록 or 수정
   */
  saveApplyClause(statusCode: string) : void {
    let ob: Observable<any>;

    this.clause.statusCode = statusCode;

    if (!this.seq) {
      ob = this.termsService.registerAdvTerms(this.clause);
    } else {
      ob = this.termsService.modifyAdvTerms(this.clause);
    }

    ob.subscribe((res) => {
      this.moveApplyClauseList('Y');
    });
  }

  /**
   * 광고신청 약관 폐기
   */
  modifyApplyTermsStatusToGarbage() : void {
    this.confirmService.confirm([
      '약관을 폐기할 경우',
      '<br>',
      '사용자 웹에 노출되지 않습니다.',
      '<br>',
      '정말 폐기하시겠습니까?'
    ].join('')).afterClosed().subscribe((confirmYn) => {
      if ('Y' == confirmYn) {
        this.termsService.modifyAdvTermsStatusToGarbage(this.seq).subscribe(() => {
          this.moveApplyClauseList('Y');
        });
      }
    });
  }

  /**
   * 광고신청 약관 미리보기 팝업 오픈
   */
  openClausePreviewer() : void {
    this.matDialog.open(ContentPreviewComponent, {
      data: {
        title: this.clause.title,
        contents: this.clause.contents
      }
    });
  }

  /**
   * 광고신청 약관 목록 페이지로 이동
   */
  moveApplyClauseList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 약관 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;

    if (this.seq) {
      this.termsService.searchAdvTerms(this.seq).subscribe((res) => {
        this.clause = res;
      });
    } else {
      this.clause = {
        advTerms: true,
        seq: 0,
        version: '',
        memo: '',
        title: '',
        contents: '',
        statusCode: ''
      };
    }
  }

}
