import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GlobalConstants} from "../../../../domain/vo/global-constants";
import {AdvPlaceService} from "../../../../service/adv-place/adv-place.service";
import {PurchaseService} from "../../../../service/purchase/purchase.service";
import {FileService} from "../../../../service/file.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Utils} from "../../../../shared/utils/utils";
import {Observable} from "rxjs";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import * as _ from 'lodash';
import {CommonComponent} from "../../../common-component";

/**
 * 광고처 - 지하철 편집
 */
@Component({
  selector: 'app-adv-subwayzone-mng',
  templateUrl: './adv-subwayzone-mng.component.html',
  styleUrls: ['./adv-subwayzone-mng.component.scss']
})
export class AdvSubwayzoneMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  constants = GlobalConstants;

  seq: number;
  subwayzone: any = {};
  info: any = {};
  files  : Array<any> = [];
  tags   : Array<any> = [];
  subways: Array<any> = [];
  selectedSubwayCount: number = 0;

  selectLists: any = {
    badgeCode: [],
    operationCode: [],
    showCode: [],
    subwayLineCode: []
  };

  timeLists: any = {
    hours: [],
    mins : [],
  }

  constructor(private advPlaceService: AdvPlaceService,
              private purchaseService: PurchaseService,
              private fileService: FileService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) {
    super();

    this.advPlaceService.searchOddiZoneCodes().subscribe((res) => {
      this.selectLists.badgeCode = [
        { name: '선택', value: '' }
      ].concat(res.badgeCode.map((item) => {
        return { name: item.name, value: item.code };
      }));

      this.selectLists.operationCode = res.operationCode.map((item) => {
        return { name: item.name, value: parseInt(item.val) ? true : false };
      });

      this.selectLists.showCode = res.showCode.map((item) => {
        return { name: item.name, value: parseInt(item.val) ? true : false };
      });

      this.selectLists.subwayLineCode = [
        { name: '선택', value: '' }
      ].concat(res.subwayLineCode.map((item) => {
        return { name: item.name, value: item.code };
      }));
    });

    for (let i: number = 0; i < 24; i++) {
      this.timeLists.hours.push(Utils.numberPad(i, 2));
    }

    for (let i: number = 0; i < 60; i++) {
      this.timeLists.mins.push(Utils.numberPad(i, 2));
    }
  }

  ngOnInit(): void {
  }

  /**
   * 지하철 등록 or 수정
   */
  saveSubwayzone() : void {
    let ob: Observable<any>;

    this.info.tags = [];
    if (this.info.tagsStr) {
      this.info.tagsStr.split(',').forEach((tag) => {
        this.info.tags.push(tag);
      });
    }

    this.info.fileSeq = [];
    if (0 < this.files.length) {
      this.files.forEach((file) => {
        this.info.fileSeq.push(file.fileSeq);
      });
    }

    this.info.subwayList = [];
    if (0 < this.subways.length) {
      this.subways.forEach((subway) => {
        if (subway.subwayCode) {
          this.info.subwayList.push(subway);
        }
      });
    }

    this.files.forEach((item, index) => {
      item.viewOrder = index;
    });

    this.info.operationStartTime =
        this.info.operationStartHour + this.info.operationStartMin + '00';
    this.info.operationEndTime =
        this.info.operationEndHour + this.info.operationEndMin + '59';

    if (!this.seq) {
      ob = this.advPlaceService.registerSubwayZone(this.info);
    } else {
      ob = this.advPlaceService.modifySubwayZone(this.info);
    }

    ob.subscribe(() => {
      this.moveSubwayzoneList('Y');
    });
  }

  /**
   * 지하철 목록 페이지로 이동
   */
  moveSubwayzoneList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 주소검색 완료 후 데이터 처리
   *
   * @param data
   */
  searchPostCodeComplete(data: any): void {
    this.info.zipcode = data.zonecode;
    this.info.addr    = data.address;
    this.info.oldAddr = data.jibunAddress || data.autoJibunAddress;
    this.info.detailAddr = data.buildingName;

    this.info.addrGu   = data.sigungu;
    this.info.addrDong = data.bname;

    switch (data.sido) {
      case '제주특별자치도':
      case '세종특별자치시':
        this.info.addrSi = data.sido.substr(0, 2);

        break;
      default:
        this.info.addrSi = data.sido;
    }
  }

  /**
   * 파일 업로드
   *
   * @param files
   */
  uploadFile(files: Array<File>, index: number): void {
    let allowTypes: boolean = true;
    let type: string = 'image';

    _.forEach(files, (file) => {
      if (!this.constants.UPLOAD_FILE.isValid(file, type)) {
        this.confirmService.alert(this.constants.UPLOAD_FILE.notValidMessage(file, type));

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
          this.files.splice(index, 0, {
            fileSeq: res.seq,
            path   : res.url
          });
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
   * 파일 순번 이동
   *
   * @param event
   */
  dragFile(event: CdkDragDrop<string[]>) {
    let prevIndex: number = event.previousIndex;
    let currIndex: number = event.currentIndex;

    let dragItem: any = this.files[prevIndex];

    this.files.splice(prevIndex, 1);
    this.files.splice(currIndex, 0, dragItem);
  }
  
  /**
   * 파일 삭제
   */
  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  /**
   * 도면파일 업로드
   *
   * @param files
   */
  uploadDocFile(files: Array<File>): void {
    let file: File = files[0];
    let type: string = 'image';

    if (this.constants.UPLOAD_FILE.isValid(file, type)) {
      let formData = new FormData();
      formData.append('file', file);

      this.spinnerService.show('full');
      this.fileService.uploadFile(formData).subscribe((res) => {
        this.info.mapFileSeq  = res.seq;
        this.info.mapFilePath = res.url;
        this.info.mapFileName = res.originName;

        this.spinnerService.hide('full');
      });
    } else {
      this.confirmService.alert(this.constants.UPLOAD_FILE.notValidMessage(file, type));
    }
  }

  /**
   * 도면파일 다운로드
   */
  downloadDocFile(): void {
    this.fileService.downloadFile(this.info.mapFileSeq, this.info.mapFileName);
  }

  /**
   * 도면파일 삭제
   */
  removeDocFile(): void {
    delete this.info.mapFileSeq;
    delete this.info.mapFilePath;
    delete this.info.mapFileName;
  }

  /**
   * 지하철 노선 변경
   */
  changeSubwayLine(index: number): void {
    let subwayCode: string = this.subways[index].subwayCode;
    this.selectedSubwayCount = 0;

    this.subways.forEach((item, itemIndex) => {
      if (index != itemIndex && subwayCode == item.subwayCode) {
        item.subwayCode = '';
      }

      this.selectedSubwayCount += item.subwayCode ? 1 : 0;
    });
  }

  /**
   * 가격 셋팅
   *
   * @param value
   */
  setSlotPrice(value: string): void {
    let buffer: string = (value || '').replace(/,/g, '');

    if (_.isNaN(buffer)) {
      buffer = '0';
    }

    this.info.slotPrice = parseInt(buffer);
  }

  /**
   * 지하철 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    let ob: Observable<any>;

    this.seq = seq;

    if (this.seq) {
      ob = this.advPlaceService.searchSubwayZone(this.seq);
      ob.subscribe((res) => {
        this.subwayzone = res;
        this.info    = res.oddiZoneBasicInfo;
        this.files   = res.oddiZoneFileList;
        this.tags    = res.oddiZoneTagList;
        this.subways = res.oddiZoneSubwayList;
        this.selectedSubwayCount = this.subways.length;

        this.info.tagsStr = this.tags.map((item) => {
          return item.tag;
        }).join(',');

        let startTime = this.info.operationStartTime;
        let endTime   = this.info.operationEndTime;

        this.info.operationStartHour = startTime.substr(0, 2);
        this.info.operationStartMin  = startTime.substr(2, 2);
        this.info.operationEndHour   = endTime.substr(0, 2);
        this.info.operationEndMin    = endTime.substr(2, 2);

        this.info.tagsStr = this.tags.map((item) => {
          return item.tag;
        }).join(',');

        for (let i: number = 0, len: number = this.subways.length; i < 4 - len; i++) {
          this.subways.push({
            subwayCode: ''
          });
        }
      });
    } else {
      ob = this.purchaseService.searchSubwayzoneConfig();
      ob.subscribe((res) => {
        this.info.totalSlot = res.slotCount;
        this.info.slotVideoTime = res.slotVideoTime;
      });

      this.subwayzone = {};
      this.info    = {};
      this.files   = [];
      this.tags    = [];
      this.subways = [];

      this.info.slotPrice      = 0;
      this.info.slotPriceLabel = 0;
      this.info.dayExpoCount   = 1;

      this.info.tagsStr = this.tags.map((item) => {
        return item.tag;
      }).join(',');

      for (let i: number = 0, len: number = this.subways.length; i < 4 - len; i++) {
        this.subways.push({
          subwayCode: ''
        });
      }

      if (0 < this.selectLists?.badgeCode?.length) {
        this.info.badgeCode = this.selectLists.badgeCode[0].value;
      }

      if (0 < this.selectLists?.operationCode?.length) {
        this.info.operation = this.selectLists.operationCode[0].value;
      }

      if (0 < this.selectLists?.showCode?.length) {
        this.info.advCaseExpo = this.selectLists.showCode[0].value;
      }

      this.advPlaceService.searchSubwayZoneDefaultConfig().subscribe((res) => {
        this.info.operationStartHour = res.operationStartTime.substr(0, 2);
        this.info.operationStartMin  = res.operationStartTime.substr(2, 2);
        this.info.operationEndHour   = res.operationEndTime.substr(0, 2);
        this.info.operationEndMin    = res.operationEndTime.substr(2, 2);
      });
    }
  }
}
