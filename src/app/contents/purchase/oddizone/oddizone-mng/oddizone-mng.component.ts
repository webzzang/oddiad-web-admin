import {Component, OnInit} from '@angular/core';
import {FileService} from "../../../../service/file.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Observable} from "rxjs";
import {PurchaseService} from "../../../../service/purchase/purchase.service";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {CommonComponent} from "../../../common-component";
import {GlobalConstants} from "../../../../domain/vo/global-constants";

@Component({
  selector: 'app-oddizone-mng',
  templateUrl: './oddizone-mng.component.html',
  styleUrls: ['./oddizone-mng.component.scss']
})
export class OddizoneMngComponent extends CommonComponent implements OnInit  {

  constants = GlobalConstants;

  selectLists: any = {
    displayDivCode: [],
    sideDisplayServiceCode: []
  };

  info: any = {};
  files: Array<any> = [];

  constructor(private fileService: FileService,
              private purchaseService: PurchaseService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) {
    super();

    this.purchaseService.searchCodes().subscribe((res) => {
      this.selectLists.displayDivCode = res.displayDivCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.selectLists.sideDisplayServiceCode = res.sideDisplayServiceCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      if (this.info.displayDiv == undefined) {
        this.info.displayDiv = this.selectLists.displayDivCode[0].value;
        this.info.sideDisplayServiceCode = this.selectLists.sideDisplayServiceCode[0].value;
      }
    });
  }


  ngOnInit(): void {
    this.init();
  }

  public init() : void {
    this.info  = {};
    this.files = [];

    this.purchaseService.searchOddizoneConfig().subscribe((res) => {
      this.info = res.partnerConfigDetailResult;
      this.files = res.partnerDefaultAdvFileList;

      this.files.forEach((file) => {
        this.correctFilePath(file);
      });

      this.info.designRequest = this.info.designRequest.toString()
    });
  }

  /**
   * ?????? ?????????
   *
   * @param files
   */
  uploadFile(files: Array<File>, index: number): void {
    let file: File = files[0];
    let type: string = file.type;
    let advTypeCode: string = type.startsWith('video') ? 'AFT002' : 'AFT001';

    if (0 == this.files.length ||
        this.files[0].defaultAdvType != advTypeCode ||
        ('AFT002' == this.files[0].defaultAdvType && 1 > this.files.length) ||
        ('AFT001' == this.files[0].defaultAdvType && 3 > this.files.length)) {

      if (this.constants.UPLOAD_FILE.isValid(file)) {
        let formData = new FormData();
        formData.append('file', file);

        this.spinnerService.show('full');
        this.fileService.uploadFile(formData).subscribe((res) => {
          let fileInfo: any = {
            defaultAdvFileSeq: res.seq,
            defaultAdvType: advTypeCode,
            fileName: res.originName,
            filePath: res.url
          };

          if (0 < this.files.length && fileInfo.defaultAdvType != this.files[0].defaultAdvType) {
            this.files.splice(0, this.files.length);
          }

          this.files.splice(index, 0, this.correctFilePath(fileInfo));

          this.spinnerService.hide('full');
        });
      } else {
        this.confirmService.alert(this.constants.UPLOAD_FILE.notValidMessage(file));
      }
    } else {
      if ('AFT002' == advTypeCode && 1 <= this.files.length) {
        this.confirmService.alert('???????????? 1?????? ?????? ???????????????.');
      } else if ('AFT001' == advTypeCode && 3 <= this.files.length) {
        this.confirmService.alert('???????????? 3????????? ?????? ???????????????.');
      }
    }
  }
  /**
   * ?????? ????????????
   */
  downloadFile(fileSeq,fileName): void {
    this.fileService.downloadFile(fileSeq, fileName);
  }

  /**
   * ?????? ??????
   */
  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  /**
   * ?????? ?????? ??????
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
   * ??????????????? ????????? path ??????
   *
   * @param file
   */
  correctFilePath(file: any): any {
    if ('AFT002' == file.defaultAdvType) {
      file.filePath = '/assets/images/img-videothum.png';
    }

    return file;
  }

  /**
   * ???????????? ??????
   *
   * @param info
   */
  configModify(type:string){

    this.confirmService.confirm('?????????????????????????').afterClosed().subscribe((confirmYn) => {
      if (confirmYn == "Y") {
        let ob: Observable<any>;
        if (type == 'slotCount') { //??????
          ob = this.purchaseService.modifyOddiZoneSlotCount(this.info);

        } else if (type == 'slotVideoTime') { //????????? ?????? ??????
          ob = this.purchaseService.modifyOddiZoneSlotVideoTime(this.info);

        } else if (type == 'oddiAdvStartDate') {//?????? ?????? ?????????
          ob = this.purchaseService.modifyOddiZoneAdvStartDate(this.info)

        } else if (type == 'oddiAdvCancelDate') { //?????? ?????? ?????????
          ob = this.purchaseService.modifyOddiZoneAdvCancelDate(this.info);

        } else if (type == 'oddiAdvMaxDate') { //?????? ?????? ??????
          ob = this.purchaseService.modifyOddiZoneOddiAdvMaxDate(this.info);

        } else { //????????? ?????? ??????
          ob = this.purchaseService.modifyOddiZoneDesignRequest(this.info);
        }

        ob.subscribe((res) => {
          if (res.code == "000") {
            this.confirmService.alert('?????????????????????.');
          }
        });
      }
    });
  }

  /**
   * ???????????? ??????
   *
   * @param info
   */
  defaultAdvModify(){
    this.confirmService.confirm('?????????????????????????').afterClosed().subscribe((confirmYn) => {

      if (confirmYn == "Y") {
        this.purchaseService.modifyOddiZoneDefaultAdv({defaultAdvFileList: this.files}).subscribe((res) => {
          if (res.code == "000") {
            this.confirmService.alert('?????????????????????.');
          }
        });
      }
    });
  }

  /**
   * ???????????? ??????
   *
   * @param info
   */
  displayDivModify(){
    this.confirmService.confirm('?????????????????????????').afterClosed().subscribe((confirmYn) => {
      if (confirmYn == "Y") {
        this.purchaseService.modifyOddiZoneDisplayDiv(this.info).subscribe((res) => {
          if (res.code == "000") {
            this.confirmService.alert('?????????????????????.');
          }
        });
      }
    });
  }
}
