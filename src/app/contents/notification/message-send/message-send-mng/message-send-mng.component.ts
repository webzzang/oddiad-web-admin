import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonComponent} from "../../../common-component";
import {NotificationService} from "../../../../service/notification/notification.service";
import {CustomLocale} from "flatpickr/dist/types/locale";
import {Korean} from "flatpickr/dist/l10n/ko";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {MatDialog} from "@angular/material/dialog";
import * as _ from "lodash";
import {CustomerSearchComponent} from "../../../share/customer-search/customer-search.component";
import {AdvPlaceSearchComponent} from "../../../share/adv-place-search/adv-place-search.component";
import {MessageGroupSearchComponent} from "../message-group-search/message-group-search.component";
import * as moment from "moment";

@Component({
  selector: 'app-message-send-mng',
  templateUrl: './message-send-mng.component.html',
  styleUrls: ['./message-send-mng.component.scss']
})
export class MessageSendMngComponent extends CommonComponent  implements OnInit {

  @ViewChild('phoneNumber') phoneNumberElem: any;

  message: any = {
  };

  selectLists: any = {
    messageTypeCode: [],
    notificationTypeCode: [],
    reservationHour: [],
    reservationMin : []
  };

  phoneNumberInput: any = {
    value: '',
  }

  datepickerLocal: CustomLocale = Korean;

  constructor(private notificationService: NotificationService,
              private confirmService: ConfirmService,
              private matDialog: MatDialog) {
    super();

    this.notificationService.searchSendSmsCodes().subscribe((res) => {
      this.selectLists.messageSendTypeCode = res.messageSendCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.selectLists.messageTypeCode = res.messageTypeCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.selectLists.notificationTypeCode = res.notificationTypeCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      for (let i: number = 8; i <= 20; i++) {
        this.selectLists.reservationHour.push(('' + i).padStart(2, '0'));
      }

      for (let i: number = 0; i <= 30; i += 30) {
        this.selectLists.reservationMin.push(('' + i).padStart(2, '0'));
      }

      this.init();
    });
  }

  ngOnInit(): void {
  }

  init(): void {
    this.message.partnerList = [];
    this.message.oddizoneList = [];
    this.message.subwayList = [];
    this.message.memberIdList = [];
    this.message.sendPhoneNumberList = [];
    this.message.messageSendType = this.selectLists.messageSendTypeCode[0].value;
    this.message.messageTypeCode = this.selectLists.messageTypeCode[0].value;
    this.message.targetCode      = this.selectLists.notificationTypeCode[0].value;
    this.message.reservationHour = this.selectLists.reservationHour[0];
    this.message.reservationMin  = this.selectLists.reservationMin[0];
    this.message.reservationDate = moment().format('YYYYMMDD');
    this.message.name            = '';
    this.message.contents        = '';
  }

  /**
   * 발송대상그룹 조회 팝업 오픈
   */
  openSearchGroupPopup(): void {
    this.matDialog.open(MessageGroupSearchComponent, {
      data : {
        openType: CustomerSearchComponent.OPEN_TYPE.SINGLE
      }
    }).afterClosed().subscribe((group) => {
      if (group) {
        this.message.name = group.groupName;
        this.message.targetCode = group.targetCode;

        if (group.targetSeq && 0 < group.targetSeq.length) {
          let seqs : Array<any> = group.targetSeq.split(',');
          let names: Array<any> = group.targetName.split(',');

          switch (group.targetCode) {
            case 'NTC005':
              this.message.oddizoneList.splice(0, this.message.oddizoneList.length);
              break;
            case 'NTC006':
              this.message.subwayList.splice(0, this.message.subwayList.length);
              break;
            case 'NTC007':
              this.message.memberIdList.splice(0, this.message.memberIdList.length);
              break;
            case 'NTC008':
              this.message.sendPhoneNumberList.splice(0, this.message.sendPhoneNumberList.length);
              break;
          }

          _.forEach(seqs, (seq, index) => {
            switch (group.targetCode) {
              case 'NTC005':
                this.message.oddizoneList.push({ partnerSeq: seq, partnerName: names[index] });
                break;
              case 'NTC006':
                this.message.subwayList.push({ partnerSeq: seq, partnerName: names[index] });
                break;
              case 'NTC007':
                this.message.memberIdList.push({ memberId: seq, memberName: names[index] });
                break;
              case 'NTC008':
                this.message.sendPhoneNumberList.push(seq);
                break;
            }
          });
        }
      }
    });
  }

  /**
   * 알림대상 코드별 조회팝업 오픈
   * 
   * @param notificationTypeCode
   */
  openSearchPopup(notificationTypeCode: string): void {
    switch(notificationTypeCode) {
      case 'NTC005':
        this.matDialog.open(AdvPlaceSearchComponent, {
          data : {
            openType: CustomerSearchComponent.OPEN_TYPE.MULTIPLE,
            channelType: 'PTT001',
            excludePartnerSeqs: this.message.oddizoneList?.map((item) => {
              return item.partnerSeq;
            })
          }
        }).afterClosed().subscribe((partners) => {
          if (partners) {
            _.forEach(partners, (partner) => {
              this.message.oddizoneList.push({ partnerSeq: partner.partnerSeq, partnerName: partner.mallName });
            });
          }
        });

        break;
      case 'NTC006':
        this.matDialog.open(AdvPlaceSearchComponent, {
          data : {
            openType: CustomerSearchComponent.OPEN_TYPE.MULTIPLE,
            channelType: 'PTT002',
            excludePartnerSeqs: this.message.subwayList?.map((item) => {
              return item.partnerSeq;
            })
          }
        }).afterClosed().subscribe((partners) => {
          if (partners) {
            _.forEach(partners, (partner) => {
              this.message.subwayList.push({ partnerSeq: partner.partnerSeq, partnerName: partner.mallName });
            });
          }
        });

        break;
      case 'NTC007':
        this.matDialog.open(CustomerSearchComponent, {
          data : {
            openType: CustomerSearchComponent.OPEN_TYPE.MULTIPLE,
            excludeMemberIds: this.message.memberIdList?.map((item) => {
              return item.memberId;
            })
          }
        }).afterClosed().subscribe((members) => {
          if (members) {
            _.forEach(members, (member) => {
              this.message.memberIdList.push({ memberId: member.id, memberName: member.name });
            });
          }
        });

        break;
      default:
        this.confirmService.alert('조회팝업을 지원하지 않는 코드입니다.');
    }
  }

  /**
   * 배열의 특정 인덱스를 제거
   *
   * @param array
   * @param index
   */
  removeItemWithIndex(array: Array<any>, index: number): void {
    array.splice(index, 1);
  }

  /**
   * 직접입력 전화번호 추가
   */
  appendPhoneNumber(): void {
    if (null != new RegExp(/010[0-9]{4}[0-9]{4}/).exec(this.phoneNumberInput.value)) {
      this.message.sendPhoneNumberList.push(this.phoneNumberInput.value);

      this.phoneNumberInput.value = this.phoneNumberInput.label = '';
    } else {
      this.confirmService.alert('전화번호가 잘못되었습니다.<br>(11자리 숫자를 입력하여 주십시오.)').afterClosed().subscribe(() => {
        this.phoneNumberElem.nativeElement.focus();
      });
    }
  }

  /**
   * 발송대상별 유효성 체크
   */
  isInvalid(): boolean {
    let result: boolean = false;

    switch (this.message.targetCode) {
      case 'NTC005':
        result = 0 == this.message.oddizoneList.length;
        break;
      case 'NTC006':
        result = 0 == this.message.subwayList.length;
        break;
      case 'NTC007':
        result = 0 == this.message.memberIdList.length;
        break;
      case 'NTC008':
        result = 0 == this.message.sendPhoneNumberList.length;
        break;
    }

    return result;
  }

  /**
   * 메세지 전송
   */
  sendMessage(): void {
    this.confirmService.confirm(
        ['작성한 메세지를 발송합니다.', '발송된 메세지는 수정,취소가 불가능 합니다.', '정말 발송하시겠습니까?'].join('<br>'), {width: 500}).afterClosed().subscribe((confirmYn) => {
          if ('Y' == confirmYn) {
            let params: any = {
              contents: this.message.contents,
              memberIdList: (() => {
                return 'NTC007' == this.message.targetCode ?
                    this.message.memberIdList : undefined
              })(),
              messageSendType: this.message.messageSendType,
              messageTypeCode: this.message.messageTypeCode,
              name: this.message.name,
              partnerList: (() => {
                switch (this.message.targetCode) {
                  case 'NTC005':
                    return this.message.oddizoneList;
                  case 'NTC006':
                    return this.message.subwayList;
                  default:
                    return undefined;
                }
              })(),
              reservationDate: (() => {
                return 'MST002' == this.message.messageSendType ?
                    [this.message.reservationDate, this.message.reservationHour, this.message.reservationMin, '00'].join('') : undefined;
              })(),
              sendPhoneNumberList: (() => {
                return 'NTC008' == this.message.targetCode ?
                    this.message.sendPhoneNumberList : undefined
              })(),
              targetCode: this.message.targetCode
            };

            this.notificationService.sendSms(params).subscribe((res) => {
              this.confirmService.alert('메세지 전송요청 완료되었습니다.');
            });
          }
    });
  }
}
