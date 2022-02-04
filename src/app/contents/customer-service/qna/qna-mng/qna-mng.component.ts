import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileService} from "../../../../service/file.service";
import {Observable} from "rxjs";
import {CommonComponent} from "../../../common-component";
import {QnaService} from "../../../../service/qna/qna.service";

/**
 * QNA 관리
 */
@Component({
  selector: 'app-qna-mng',
  templateUrl: './qna-mng.component.html',
  styleUrls: ['./qna-mng.component.scss']
})
export class QnaMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
  };

  seq: number;
  qna: any = {};

  constructor(private qnaService: QnaService,
              private fileService: FileService) {
    super();
  }

  ngOnInit() : void {
  }

  /**
   * QNA 정보 등록 or 수정
   */
  saveQna() : void {
    let ob: Observable<any>;

    if (!this.seq) {
      ob = this.qnaService.register(this.qna);
    } else {
      ob = this.qnaService.modify(this.qna);
    }

    ob.subscribe((res) => {
      this.moveQnaList('Y');
    });
  }

  /**
   * QNA 계정 관리 메뉴로 이동
   */
  moveQnaList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }


  /**
   * 파일 다운로드
   */
  downloadFile(): void {
    this.fileService.downloadFile(this.qna.fileSeq, this.qna.fileName);
  }

  /**
   * QNA 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;
    this.qna = {};

    if (this.seq) {
      this.qnaService.search(this.seq).subscribe((res) => {
        this.qna = res;
        this.qna.contents = this.qna.contents?.replace(/(\r\n|\n|\r)/gm, '<br>');
      });
    }
  }
}
