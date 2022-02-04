import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {CommonComponent} from "../../../common-component";
import {AdvPlaceService} from "../../../../service/adv-place/adv-place.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {FileService} from "../../../../service/file.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Utils} from "../../../../shared/utils/utils";
import {isNaN} from "lodash";
import {GlobalConstants} from "../../../../domain/vo/global-constants";
import {PurchaseService} from "../../../../service/purchase/purchase.service";
import * as _ from "lodash";

/**
 * 광고처 - 오디존 편집
 */
@Component({
  selector: 'app-adv-oddizone-mng',
  templateUrl: './adv-oddizone-mng.component.html',
  styleUrls: ['./adv-oddizone-mng.component.scss']
})
export class AdvOddizoneMngComponent extends CommonComponent implements OnInit {

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  constants = GlobalConstants;

  seq: number;
  oddizone: any = {};
  info: any = {};
  devices: Array<any> = [];
  files  : Array<any> = [];
  tags   : Array<any> = [];

  selectLists: any = {
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
   * 오디존 등록 or 수정
   */
  saveOddizone() : void {
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

    this.info.deviceId = [];
    if (0 < this.devices.length) {
      this.devices.forEach((device) => {
        this.info.deviceId.push(device);
      });
    }

    this.files.forEach((item, index) => {
      item.viewOrder = index;
    });

    this.info.operationStartTime =
        this.info.operationStartHour + this.info.operationStartMin + '00';
    this.info.operationEndTime =
        this.info.operationEndHour + this.info.operationEndMin + '59';

    this.info.ownerPhoneNumber = this.info.ownerPhoneNumber.replace(/-/g, '');

    if (!this.seq) {
      ob = this.advPlaceService.registerOddiZone(this.info);
    } else {
      ob = this.advPlaceService.modifyOddiZone(this.info);
    }

    ob.subscribe((res) => {
      if (res.body) {
        switch (res.body.code) {
          case '000':
            this.moveOddizoneList('Y');
            break;
          case '014':
            this.confirmService.alert(['사용중인 매체코드입니다.', '다시 확인하여 주십시오.', '(' + res.body.data.join(',') + ')'].join('<br>'));
            break;
          case '015':
            this.confirmService.alert(['존재하지 않는 매체코드입니다.', '다시 확인하여 주십시오.', '(' + res.body.data.join(',') + ')'].join('<br>'));
            break;
          default:
            this.confirmService.alert(res.body.message);
        }
      } else {
        this.moveOddizoneList('Y');
      }
    });
  }

  /**
   * 오디존 목록 페이지로 이동
   */
  moveOddizoneList(refreshYn: string) : void {
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
  dragFile(event: CdkDragDrop<string[]>) {
    let prevIndex: number = event.previousIndex;
    let currIndex: number = event.currentIndex;

    let dragItem: any = this.files[prevIndex];

    this.files.splice(prevIndex, 1);
    this.files.splice(currIndex, 0, dragItem);
  }

  /**
   * 가격 셋팅
   *
   * @param value
   */
  setSlotPrice(value: string): void {
    let buffer = (value || '').replace(/,/g, '');

    if (isNaN(buffer)) {
      buffer = '0';
    }

    this.info.slotPrice = parseInt(buffer);
  }

  /**
   * 기기 추가
   */
  addDevice(): void {

    this.devices.push({
      name: '',
      deviceId: '',
      displayDiv: 'divisions_1'
    });
  }

  /**
   * 기기 삭제
   *
   * @param index
   */
  removeDevice(index: number): void {
    this.devices.splice(index, 1);
  }

  /**
   * 오디존 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    let ob: Observable<any> = new Observable<any>();

    this.seq = seq;

    if (this.seq) {
      ob = this.advPlaceService.searchOddiZone(this.seq);
      ob.subscribe((res) => {
        this.oddizone = res;
        this.info     = res.oddiZoneBasicInfo;
        this.devices  = res.oddiZoneDeviceList;
        this.files    = res.oddiZoneFileList;
        this.tags     = res.oddiZoneTagList;

        this.info.tagsStr = this.tags.map((item) => {
          return item.tag;
        }).join(',');

        let startTime = this.info.operationStartTime;
        let endTime   = this.info.operationEndTime;

        this.info.operationStartHour = startTime.substr(0, 2);
        this.info.operationStartMin  = startTime.substr(2, 2);
        this.info.operationEndHour   = endTime.substr(0, 2);
        this.info.operationEndMin    = endTime.substr(2, 2);

        if (this.info.ownerPhoneNumber) {
          this.info.ownerPhoneNumberLabel = this.info.ownerPhoneNumber.replace(/-/g, '');
        }
      });
    } else {
      this.purchaseService.searchOddizoneConfig().subscribe((res) => {
        this.info.totalSlot = res.slotCount;
        this.info.slotVideoTime = res.slotVideoTime;
      });

      this.oddizone = {};
      this.info     = {};
      this.files    = [];
      this.tags     = [];
      this.devices  = [];

      this.info.slotPrice      = 0;
      this.info.slotPriceLabel = 0;
      this.info.dayExpoCount   = 1;

      this.info.operationStartHour = '00';
      this.info.operationStartMin  = '00';
      this.info.operationEndHour   = '23';
      this.info.operationEndMin    = '59';

      if (0 < this.selectLists?.badgeCode?.length) {
        this.info.badgeCode = this.selectLists.badgeCode[0].value;
      }

      if (0 < this.selectLists?.operationCode?.length) {
        this.info.operation = this.selectLists.operationCode[0].value;
      }

      if (0 < this.selectLists?.showCode?.length) {
        this.info.advCaseExpo = this.selectLists.showCode[0].value;
      }
    }
  }
}
