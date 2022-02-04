import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FileService} from "../../../../service/file.service";
import {Observable} from "rxjs";
import {CommonComponent} from "../../../common-component";
import {AdvJudgeService} from "../../../../service/adv-judge/adv-judge.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {NgxSpinnerService} from "ngx-spinner";
import {GlobalConstants} from "../../../../domain/vo/global-constants";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import * as _ from 'lodash';

/**
 * 광고심사 관리
 */
@Component({
  selector: 'app-judge-mng',
  templateUrl: './judge-mng.component.html',
  styleUrls: ['./judge-mng.component.scss']
})
export class JudgeMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();
  @ViewChild('rejectionDataGrid') rejectionDataGrid: AgGridComponent;

  constants = GlobalConstants;

  readonly docStatus: any = {
    nothing: 0, approval: 1, reject: 2
  };

  selectLists: any = {
    rejectionCode: []
  };

  seq: number;
  judge: any = {};
  info: any = {};
  files: Array<any> = [];
  partners: Array<any> = [];
  rejections: Array<any> = [];
  rejectionGrid: any = {};

  constructor(private advJudgeService: AdvJudgeService,
              private fileService: FileService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) {
    super();

    this.advJudgeService.searchCodes().subscribe((res) => {
      this.selectLists.rejectionCode = [
        { name: '선택', value: '' }
      ].concat(res.rejectionCode.map((item) => {
        return { name: item.name, value: item.code };
      }));
    });
  }

  ngOnInit() : void {
  }

  /**
   * 광고심사 정보 등록 or 수정
   */
  saveJudge(audit?: number) : void {
    let ob: Observable<any>;

    this.files.forEach((item, index) => {
      item.viewOrder = index;
      item.regDate = item.regDate.split(' ').join('T');
    });

    let params: any = {
      seq: this.info.seq,
      advFileList: this.files,
      auditEnum: audit,
      memo: this.info.memo,
      rejectionCode: this.info.rejectionCode,
      rejectionReason: this.info.rejectionReason,
      name: this.info.name,
      phoneNumber: this.info.phoneNumber,
      title: this.info.title,
      regDate: this.info.regDate,
      startDate: this.info.startDate,
      endDate: this.info.endDate
    };

    if (this.docStatus.nothing == audit) {
      ob = this.advJudgeService.modify(params);
    } else {
      ob = this.advJudgeService.modifyAudit(params);
    }

    ob.subscribe(() => {
      this.moveJudgeList('Y');
    });
  }

  /**
   * 광고심사 관리 메뉴로 이동
   */
  moveJudgeList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 파일 업로드
   *
   * @param files
   */
  uploadFile(files: Array<File>, index: number): void {
    let allowTypes: boolean = true;

    _.forEach(files, (file) => {
      if (!this.constants.UPLOAD_FILE.isValid(file)) {
        this.confirmService.alert(this.constants.UPLOAD_FILE.notValidMessage(file));

        return allowTypes = false;
      }
    });

    if (allowTypes) {
      this.spinnerService.show('full');

      let promises: Array<Promise<any>> = [];

      _.forEach(files, (file) => {
        let formData: FormData = new FormData();
        formData.append('file', file);

        promises.push(this.fileService.uploadFile(formData).toPromise().then((res) => {
          this.files.splice(index, 0, this.correctFilePath({
            advSeq : this.info.seq,
            regDate: this.info.nowTime,
            fileSeq: res.seq,
            name: res.originName,
            path: res.url,
            type: file.type.startsWith('video') ? 'AFT002' : 'AFT001'
          }));
        }));
      });

      Promise.all(promises)
        .catch(() => {
          this.confirmService.alert('오류가 발생하였습니다.<br>관리자에게 문의하여 주십시오.');
        })
        .finally(() => {
          this.spinnerService.hide('full');
        });
    }
  }

  /**
   * 파일 다운로드
   */
  downloadFile(seq: number, name: string): void {
    this.fileService.downloadFile(seq, name);
  }

  /**
   * 파일 삭제
   */
  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  /**
   * 파일 순번 이동
   *
   * @param event
   */
  dragFile(event: CdkDragDrop<string[]>): void {
    let prevIndex: number = event.previousIndex;
    let currIndex: number = event.currentIndex;

    let dragItem: any = this.files[prevIndex];

    this.files.splice(prevIndex, 1);
    this.files.splice(currIndex, 0, dragItem);
  }

  /**
   * 결제 취소
   */
  cancelPayment(): void {
    this.confirmService.confirm('결제를 취소하시겠습니까?').afterClosed().subscribe((confirmYn) => {
      if (confirmYn == "Y") {
        this.advJudgeService.cancelPayment(this.info.seq, this.info.id).subscribe((res) => {
          if ('000' == res.body?.code) {
            if ('00' == res.body.data.resultCode) {
              this.confirmService.alert("취소가 완료되었습니다.").afterClosed().subscribe(() => {
                this.moveJudgeList('Y');
              });
            } else {
              this.confirmService.alert(res.body.data.resultMsg).afterClosed().subscribe(() => {
                this.moveJudgeList('N');
              });
            }
          }
        });
      }
    });
  }

  /**
   * 파일타입에 맞게끔 path 변경
   * 
   * @param file
   */
  correctFilePath(file: any): any {
    if ('AFT002' == file.type) {
      file.path = '/assets/images/img-videothum.png';
    }

    return file;
  }

  /**
   * 상세내용 팝업 오픈
   *
   * @param item
   * @private
   */
  private openContentsDetailPopup(item): void {
    let rejectionReason: string = item.rowData?.rejectionReason?.replace(/(\r\n|\n|\r)/gm, '<br>');

    this.confirmService.alert(rejectionReason, {width: 1200});
  }

  /**
   * 광고심사 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;
    this.judge = {};
    this.info  = {};
    this.files = [];
    this.partners = [];

    if (this.seq) {
      this.advJudgeService.search(this.seq).subscribe((res) => {
        this.judge      = res;
        this.info       = res.advBasicInfo;
        this.files      = res.advFileList;
        this.partners   = res.advPartnerList;
        this.rejections = res.rejectionList;
        this.judge.seq  = res.advBasicInfo.seq;

        this.rejections.forEach((rejection, index) => {
          rejection.no = this.rejections.length - index;
        });

        this.rejectionGrid = {
          isInitLoad: true,
          defaultColDef: {
            cellStyle : {
              'text-align' : 'center'
            }
          },
          gridHeight: 40 + (this.rejections.length ? 6 : 0) + (this.rejections.length || 4) * 36,
          rowClassRules: {},
          columnDefs: [
            { headerName: '순번'  , field: 'no', width: 70, sortable: false, useSort: false },
            { headerName: '신청일시'  , field: 'advRegDate', width: 150, sortable: false, useSort: false },
            { headerName: '보류일시'  , field: 'rejectionDate', width: 150, sortable: true, useSort: false },
            { headerName: '처리 관리자', field: 'rejectionName', width: 100, sortable: true, useSort: false },
            { headerName: '보류타입'  , field: 'rejectionCodeName', width: 100, sortable: true, useSort: false },
            { headerName: '상세사유', field: 'rejectionReason', width: 700, sortable: true, useSort: false,
              cellRenderer: "buttonRenderer",
              cellRendererParams: {
                onClick: this.openContentsDetailPopup.bind(this)
              }
            },
          ]
        };

        this.files.forEach((file) => {
          this.correctFilePath(file);
        });

        if (!this.info.rejectionCode) {
          if (0 < this.selectLists.rejectionCode?.length) {
            this.info.rejectionCode = this.selectLists.rejectionCode[0].value;
          }
        }
      });
    }
  }
}
