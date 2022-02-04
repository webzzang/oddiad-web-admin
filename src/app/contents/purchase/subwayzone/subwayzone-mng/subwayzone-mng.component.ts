import { Component, OnInit } from '@angular/core';
import {PurchaseService} from "../../../../service/purchase/purchase.service";
import {CommonComponent} from "../../../common-component";
import {Observable} from "rxjs";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Utils} from "../../../../shared/utils/utils";

@Component({
  selector: 'app-subwayzone-mng',
  templateUrl: './subwayzone-mng.component.html',
  styleUrls: ['./subwayzone-mng.component.scss']
})
export class SubwayzoneMngComponent extends CommonComponent implements OnInit {

  info: any = {};
  timeLists: any = {
    hours: [],
    mins : [],
  }

  constructor(private purchaseService: PurchaseService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) {
    super();

    this.searchSubwayData();
    for (let i: number = 0; i < 24; i++) {
      this.timeLists.hours.push(Utils.numberPad(i, 2));
    }

    for (let i: number = 0; i < 60; i++) {
      this.timeLists.mins.push(Utils.numberPad(i, 2));
    }
  }

  ngOnInit(): void {
    this.init();
  }

  public init() : void {
    console.log("subwayzone-mng.component.ts");

  }

  /**
   * 지하철광고 설정 조회
   */
  searchSubwayData(): void {
    this.purchaseService.searchSubwayzoneConfig().subscribe((res) => {
      console.log(res);
      this.info = res
      let startTime = this.info.operationStartTime;
      let endTime   = this.info.operationEndTime;

      this.info.operationStartHour = startTime.substr(0, 2);
      this.info.operationStartMin  = startTime.substr(2, 2);
      this.info.operationEndHour   = endTime.substr(0, 2);
      this.info.operationEndMin    = endTime.substr(2, 2);

      this.info.designRequest = this.info.designRequest.toString()

    });
  }

  /**
   * 기본설정 저장
   *
   * @param info
   */
  configModify(type:string){

    this.confirmService.confirm('저장하시겠습니까?').afterClosed().subscribe((confirmYn) => {
      if (confirmYn == "Y") {
        console.log(type)
        let ob: Observable<any>;
        if (type == 'slotCount') { //슬롯
          ob = this.purchaseService.modifySubwaySlotCount(this.info);

        } else if (type == 'slotVideoTime') { //슬롯당 노출 시간
          ob = this.purchaseService.modifySubwaySlotVideoTime(this.info);

        } else if (type == 'subwayAdvLastDate') { //지하철 익월 광고 신청 마감일
          ob = this.purchaseService.modifySubwaySubwayAdvLastDate(this.info);

        } else if (type == 'subwayAdvMaxStartDate') {//광고 시작 가능일
          ob = this.purchaseService.modifySubwayAdvMaxStartDate(this.info)

        } else if (type == 'subwayAdvCancelDate') { //신청 취소 가능일
          ob = this.purchaseService.modifySubwayAdvCancelDate(this.info);

        } else if (type == 'subwayAdvMaxDate') { //최장 광고 기간
          ob = this.purchaseService.modifySubwayAdvMaxDate(this.info);

        } else if (type == 'designRequest') { // 디자인 요청
          ob = this.purchaseService.modifySubwayDesignRequest(this.info);

        } else { //디자인 제작 옵션

          this.info.operationStartTime =
              this.info.operationStartHour + this.info.operationStartMin + '00';
          this.info.operationEndTime =
              this.info.operationEndHour + this.info.operationEndMin + '59';

          ob = this.purchaseService.modifySubwayOperationTime(this.info);
        }

        ob.subscribe((res) => {
          if (res.body.code == "000") {
            this.confirmService.alert('저장하였습니다.');
          }
        });
      }
    });
  }

}
