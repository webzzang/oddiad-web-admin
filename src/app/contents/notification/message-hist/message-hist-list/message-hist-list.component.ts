import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import {CommonComponent} from "../../../common-component";
import {NotificationService} from "../../../../service/notification/notification.service";
import * as moment from "moment/moment";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";

/**
 * 메세지 전송 이력 목록
 */
@Component({
  selector: 'app-message-hist-list',
  templateUrl: './message-hist-list.component.html',
  styleUrls: ['./message-hist-list.component.scss']
})
export class MessageHistListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists : any = {
    messageSendTypeCode: [],
    targetTypeCode: []
  };

  constructor(private notificationService : NotificationService, private confirmService: ConfirmService) {
    super();

    this.notificationService.searchHistSmsCodes().subscribe((res) => {
      let messageSendTypeCode: Array<any> = res.messageSendTypeCode.map((item) => {
        return { name: item.name, value: item.val };
      });

      let targetTypeCode: Array<any> = res.targetTypeCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.init(messageSendTypeCode, targetTypeCode);
    });
  }

  ngOnInit() : void {
  }

  private init(messageSendTypeCode: Array<any>, targetTypeCode: Array<any>) : void {
    this.grid = {
      api: NotificationService.URL.SEARCH_HISTORY_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '타입', field: 'messageSendTypeName', width: 100, sortable: false, useSort: false },
        { headerName: '대상 구분', field: 'targetTypeName', width: 150, sortable: true, useSort: false },
        { headerName: '고객명', field: 'receiveName', width: 120, sortable: true, useSort: false },
        { headerName: '휴대전화번호', field: 'receivePhoneNumber', width: 150, sortable: true, useSort: false },
        { headerName: '내용', field: 'contents', width: 250, sortable: true, useSort: false,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.openContentsDetailPopup.bind(this)
          }
        },
        { headerName: '발송 매체', field: 'sendTypeName', width: 150, sortable: true, useSort: false },
        { headerName: '결과', field: 'successName', width: 100, sortable: true, useSort: false },
        { headerName: '발송자', field: 'senderEmail', width: 200, sortable: true, useSort: false },
        { headerName: '발송일시', field: 'regDate', width: 150, sortable: true, useSort: false },
        { headerName: '재발송', field: 'seq', width: 100, sortable: false, useSort: false,
          valueGetter: () => '재발송',
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.resend.bind(this)
          }
        }
      ]
    };

    this.selectLists = {
      messageSendTypeCode: messageSendTypeCode,
      targetTypeCode: targetTypeCode,
      searchType: [
        { name: '내용', value: 'contents' },
        { name: '고객 이름', value: 'receiveName' },
        { name: '전화번호', value: 'receivePhoneNumber' }
      ],
      periodType: [
        { name: '발송일', value: 'searchReg' }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "발송타입", nameWidth: '150', inputType: SearchInputType.select, id: 'messageSendTypeVal', width: 150, class: '',
          options: this.selectLists.messageSendTypeCode, selectedValue: '' },
        { displayName: "대상구분", nameWidth: '150', inputType: SearchInputType.select, id: 'targetTypeCode', width: 150, class: '',
          options: this.selectLists.targetTypeCode, selectedValue: '' },
        { displayName: "기간검색", nameWidth: '150', inputType: SearchInputType.selDateRangeRadio, id: 'periodType', searchCondComo: true,
          options: this.selectLists.periodType, selectedValue: '', width: 1000, class: '', placeHolder:' ',
          group: moment().milliseconds(),
          dateRangeRadioOptions: [
            {value: '-1,M', label: '1개월 전'},
            {value: '-7,d', label: '7일 전', checked: true},
            {value:  '0,d', label: '오늘'}
          ]
        },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'}
      ],
      searchBtnHandler: ($event) : void => {
        this.search.params = $event;

        let searchType  = this.search.params.searchType;
        let searchValue = this.search.params.searchValue;

        if (searchType && searchValue) {
          this.search.params[searchType] = searchValue;
        }

        let periodType = this.search.params.periodType;
        let startDate  = this.search.params.startDate;
        let endDate    = this.search.params.endDate;

        if (periodType && startDate && endDate) {
          this.search.params[periodType + 'StartDate'] = startDate;
          this.search.params[periodType + 'EndDate'] = endDate;
        }

        ['searchType', 'searchValue', 'periodType', 'startDate', 'endDate'].forEach((name) => {
          delete this.search.params[name];
        });

        this.searchSendHistList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 메세지 전송 이력 목록 조회
   * 
   * @param params 조회조건
   * @private
   */
  private searchSendHistList(params): void {
    this.dataGrid.getList(params);
  }

  /**
   * 이벤트 데이타
   *
   * @param item
   * @private
   */
  private openContentsDetailPopup(item): void {
    let contents: string = item.rowData?.contents?.replace(/(\r\n|\n|\r)/gm, '<br>');

    this.confirmService.alert(contents, {width: 1200});
  }

  /**
   * 재전송
   *
   * @param event
   * @private
   */
  private resend(event: any): void {
    this.notificationService.resendSms(event?.rowData?.seq).subscribe((res) => {
      if ('000' == (res.body?.code)) {
        this.confirmService.alert('재발송 되었습니다.');
      } else {
        this.confirmService.alert(res.message || res.body?.message);
      }
    });
  }
}
