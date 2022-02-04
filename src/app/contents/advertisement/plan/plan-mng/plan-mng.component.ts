import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FileService} from "../../../../service/file.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonComponent} from "../../../common-component";
import {AdvPlanService} from "../../../../service/adv-plan/adv-plan.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import * as _ from "lodash";
import * as moment from "moment";
import {GlobalConstants} from "../../../../domain/vo/global-constants";


/**
 * 광고편성 편집
 */
@Component({
  selector: 'app-plan-mng',
  templateUrl: './plan-mng.component.html',
  styleUrls: ['./plan-mng.component.scss']
})
export class PlanMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
    displayDivCode: [],
    sideDisplayServiceCode: []
  };

  seq: number;
  deviceId: string;
  plan: any = {};
  info: any = {};
  nowExpos : Array<any> = [];
  waitExpos: Array<any> = [];
  nowExpoFiles : Array<any> = [];
  waitExpoFiles: Array<any> = [];
  defaultAdv: any = {};

  existsAllAdvFile: boolean = true;

  constructor(private advPlanService: AdvPlanService,
              private fileService: FileService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) {
    super();

    this.advPlanService.searchCodes().subscribe((res) => {
      this.selectLists.displayDivCode = res.displayDivCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.selectLists.sideDisplayServiceCode = res.sideDisplayServiceCode.map((item) => {
        return { name: item.name, value: item.code };
      });
    });
  }

  ngOnInit() : void {
  }

  /**
   * 광고편성 정보 등록 or 수정
   */
  savePlan() : void {
    this.advPlanService.modify(this.makePlanParams()).subscribe((res) => {
      this.movePlanList('Y');
    });
  }

  /**
   * 광고편성 등록/수정 파라메터 생성
   */
  makePlanParams(): any {
    let params: any = Object.assign({
      seq: this.info.seq,
      deviceId: this.info.deviceId,
      advFileList: [],
      advExpoList: this.nowExpos,
      defaultAdvExpo: this.defaultAdv.expo,
      channelType: this.info.channelType
    }, this.extractDivInfo());

    let files: Array<any> = params.advFileList;

    if (this.hasNowExpos()) {
      this.nowExpos.forEach((nowExpo, index) => {
        nowExpo.viewOrder = index + 1;

        nowExpo.advFileList.forEach((file, fileIndex) => {
          file.viewOrder = fileIndex + 1;
          file.regDate = this.info.nowDate;
          files.push(file);
        });
      });
    }

    this.waitExpos.forEach((waitExpo, index) => {
      waitExpo.viewOrder = index + 1;

      waitExpo.advFileList.forEach((file, fileIndex) => {
        file.viewOrder = fileIndex + 1;
        file.regDate = this.info.nowDate;
        files.push(file);
      });
    });

    return params;
  }

  /**
   * 기기송출
   */
  sendToEnvironment(): void {
    this.advPlanService.sendToEquipment(this.info.seq, this.info.deviceId, this.makePlanParams()).subscribe((res) => {
      switch (res.success) {
        case 0:
          this.confirmService.alert('기기가 연결되어 있지 않습니다.');
          break;
        case 1:
          this.confirmService.alert('기기로 전송되었습니다.');
          break;
      }
    });
  }

  /**
   * 노출중인 광고파일 다운로드
   */
  downloadExposeFiles(): void {
    this.downloadFiles('광고편성(노출)', [this.defaultAdv].concat(this.nowExpos));
  }

  /**
   * 대기중인 광고파일 다운로드
   */
  downloadWaitFiles(): void {
    this.downloadFiles('광고편성(대기)', this.waitExpos);
  }

  /**
   * 광고파일 다운로드
   *
   * @param typeName
   * @param advs
   */
  downloadFiles(typeName: string, advs: Array<any>): void {
    let files: Array<any> = [];
    let fileName : string;
    let fileExt  : string;

    _.forEach(advs, (adv) => {
      if (_.isArray(adv.advFileList)) {
        _.forEach(adv.advFileList, (file, index) => {
          fileName = [adv.startDate.replace(/-/g, ''), adv.title, index].join('_').replace(/\s/g, '');
          fileExt  = file.fileName.substring(file.fileName.lastIndexOf('.', ) + 1, file.fileName.length);

          files.push({
            seq : file.fileSeq,
            name: [fileName, fileExt].join('.'),
          });
        });
      }
    });

    this.fileService.downloadFiles([this.info.mallName, typeName, moment().format('YYYYMMDDHHmmss')].join('_'), files);
  }

  /**
   * 광고편성 관리 메뉴로 이동
   */
  movePlanList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 파일 업로드
   *
   * @param files
   */
  uploadFile(files: Array<any>, parent: any, selectedFiles: Array<File>, index: number): void {
    let selectedFile: File = selectedFiles[0];

    if (GlobalConstants.UPLOAD_FILE.type.isValid(selectedFile)) {
      if (GlobalConstants.UPLOAD_FILE.size.isValid(selectedFile)) {
        let formData = new FormData();
        formData.append('file', selectedFile);

        this.spinnerService.show('full');
        this.fileService.uploadFile(formData).subscribe((res) => {
          files.splice(index, 0, this.correctFilePath({
            advSeq : parent.advSeq,
            fileSeq: res.seq,
            fileName: res.originName,
            filePath: res.url,
            type: selectedFile.type.startsWith('video') ? 'AFT002' : 'AFT001'
          }));

          this.existsAllAdvFile = this.existsAllAdvFiles();

          this.spinnerService.hide('full');
        });
      } else {
        this.confirmService.alert(GlobalConstants.UPLOAD_FILE.size.notValidMessage(selectedFile));
      }
    } else {
      this.confirmService.alert(GlobalConstants.UPLOAD_FILE.type.notValidMessage(selectedFile));
    }
  }

  /**
   * 파일 다운로드
   */
  downloadFile(seq: number, name: string): void {
    this.fileService.downloadFile(seq, name);
  }

  /**
   * 파일 순번 이동
   *
   * @param event
   */
  dragFile(files: Array<any>, event: CdkDragDrop<string[]>): void {
    let prevIndex: number = event.previousIndex;
    let currIndex: number = event.currentIndex;

    let dragItem: any = files[prevIndex];

    files.splice(prevIndex, 1);
    files.splice(currIndex, 0, dragItem);
  }

  /**
   * 파일 삭제
   */
  removeFile(files: Array<any>, index: number): void {
    files.splice(index, 1);

    this.existsAllAdvFile = this.existsAllAdvFiles();
  }

  /**
   * 광고 드래그 이벤트 핸들러
   *
   * @param list
   * @param event
   * @param hasDefaultAdv
   */
  dragAdv(list: Array<any>, event: CdkDragDrop<string[]>, hasDefaultAdv: boolean = false): void {
    let prevIndex: number = event.previousIndex;
    let currIndex: number = event.currentIndex;
    let correct  : number = hasDefaultAdv ? -2 : -1;

    if (hasDefaultAdv && 0 == currIndex) {
      this.confirmService.alert('기본광고는 순서변경을 할 수 없습니다.');

      return ;
    }

    let dragItem: any = list[prevIndex + correct];

    list.splice(prevIndex + correct, 1);
    list.splice(currIndex + correct, 0, dragItem);
  }

  /**
   * 파일경로 변경
   *
   * @param file
   */
  correctFilePath(file: any): any {
    if ('AFT002' == file.type) {
      file.filePath = '/assets/images/img-videothum.png';
    }

    return file;
  }

  /**
   * 기본광고 정보 추출
   */
  extractDefaultAdv(): void {
    let defaultExpoAdv: any = {};

    if (this.hasNowExpos()) {
      _.forEach(this.nowExpos, (nowExpo, index) => {
        if (0 == nowExpo.advSeq) {
          defaultExpoAdv = nowExpo;
          defaultExpoAdv.startDate = '0000-00-00';
          defaultExpoAdv.endDate   = '9999-12-31';
          this.nowExpos.splice(index, 1);
          return false;
        }
      });
    }

    return defaultExpoAdv;
  }

  /**
   * 영역정보 추출
   */
  extractDivInfo(): any {
    let divInfo: any = {
      displayDiv: this.info.displayDiv
    };

    switch (this.info.displayDiv) {
      case 'divisions_2':
        divInfo.sideContentsType = this.info.sideContentsType;
        break;
      case 'divisions_3':
        divInfo.sideContentsType = this.info.sideContentsType;
        divInfo.bottomContentsType = 'BDT001';
        break;
    }

    return divInfo;
  }

  /**
   * 모든 광고에 맵핑된 광고파일 존재여부 확인
   */
  existsAllAdvFiles(): boolean {
    let result: boolean = true;

    _.forEach(this.nowExpos, (nowExpo) => {
        if (0 == nowExpo.advFileList.length) {
          return result = false;
        }
    });

    if (this.existsAllAdvFile) {
      _.forEach(this.waitExpos, (waitExpo) => {
        if (0 == waitExpo.advFileList.length) {
          return result = false;
        }
      });
    }

    return result;
  }

  /**
   * 광고편성 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(data: any) : void {
    this.seq = data.seq;
    this.deviceId = data.deviceId;
    this.plan  = {};
    this.info  = {};
    this.nowExpos  = [];
    this.waitExpos = [];

    if (this.seq) {
      this.advPlanService.search(this.seq, this.deviceId).subscribe((res) => {
        this.plan      = res;
        this.info      = res.advBasicInfo;
        this.nowExpos  = res.advNowExpoList;
        this.waitExpos = res.advWaitExpoList;
        this.nowExpoFiles  = res.advNowExpoFileList;
        this.waitExpoFiles = res.advWaitExpoFileList;

        if (this.hasNowExpos()) {
          this.nowExpos.forEach((nowExpo) => {
            nowExpo.advFileList = [];

            this.nowExpoFiles.forEach((file) => {
              if (file.advSeq == nowExpo.advSeq) {
                nowExpo.advFileList.push(this.correctFilePath(file));
              }
            });
          });
        }

        this.waitExpos.forEach((waitExpo) => {
          waitExpo.advFileList = [];

          this.waitExpoFiles.forEach((file) => {
            if (file.advSeq == waitExpo.advSeq) {
              waitExpo.advFileList.push(this.correctFilePath(file));
            }
          });
        });

        this.defaultAdv = this.extractDefaultAdv();
        this.existsAllAdvFile = this.existsAllAdvFiles();
        this.info.sideContentsType = this.info.sideContentsType || this.selectLists.sideDisplayServiceCode[0].value;
      });
    }
  }

  /**
   * 현재 노출광고 존재여부 확인
   *
   * @private
   */
  private hasNowExpos(): boolean {
    return this.nowExpos && 0 < this.nowExpos.length;
  }
}
