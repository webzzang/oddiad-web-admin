import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {CommonComponent} from "../../../common-component";
import {NoticeService} from "../../../../service/notice/notice.service";
import {FileService} from "../../../../service/file.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {GlobalConstants} from "../../../../domain/vo/global-constants";
import {NgxSpinnerService} from "ngx-spinner";

/**
 * 공지사항 관리
 */
@Component({
  selector: 'app-notice-mng',
  templateUrl: './notice-mng.component.html',
  styleUrls: ['./notice-mng.component.scss']
})
export class NoticeMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
    expoCode: []
  };

  seq: number;
  notice: any = {};

  constants = GlobalConstants;

  constructor(private noticeService: NoticeService,
              private fileService: FileService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) {
    super();

    this.noticeService.searchCodes().subscribe(res => {
      this.selectLists.expoCode = res.expoCode.map(item => {
        return {name: item.name, value: parseInt(item.val) ? true : false};
      });
    });
  }

  ngOnInit() : void {
  }

  /**
   * 공지사항 정보 등록 or 수정
   */
  saveNotice() : void {
    let ob: Observable<any>;

    if (!this.seq) {
      ob = this.noticeService.register(this.notice);
    } else {
      ob = this.noticeService.modify(this.notice);
    }

    ob.subscribe((res) => {
      this.moveNoticeList('Y');
    });
  }

  /**
   * 공지사항 계정 관리 메뉴로 이동
   */
  moveNoticeList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 파일 업로드
   *
   * @param files
   */
  uploadFile(files: Array<File>): void {
    let file: File = files[0];

    if (this.constants.UPLOAD_FILE.isValid(file, 'image')) {
      this.spinnerService.show('full');

      let formData = new FormData();
      formData.append('file', files[0]);

      this.fileService.uploadFile(formData).subscribe((res) => {
        this.notice.fileSeq  = res.seq;
        this.notice.filePath = res.url;
        this.notice.fileName = res.originName;

        this.spinnerService.hide('full');
      });
    } else {
      this.confirmService.alert(this.constants.UPLOAD_FILE.notValidMessage(file, 'image'));
    }
  }

  /**
   * 파일 다운로드
   */
  downloadFile(): void {
    this.fileService.downloadFile(this.notice.fileSeq, this.notice.fileName);
  }

  /**
   * 파일 삭제
   */
  removeFile(): void {
    delete this.notice.fileSeq;
    delete this.notice.filePath;
    delete this.notice.fileName;
  }

  /**
   * 공지사항 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;
    this.notice = {};

    if (this.seq) {
      this.noticeService.search(this.seq).subscribe((res) => {
        this.notice = res;
      });
    } else {
      if (0 < this.selectLists.expoCode?.length) {
        this.notice.expo = this.selectLists.expoCode[0].value;
      }
    }
  }
}
