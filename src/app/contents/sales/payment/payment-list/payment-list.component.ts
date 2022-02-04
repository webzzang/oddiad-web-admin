import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment";
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {CommonComponent} from "../../../common-component";
import {AdvJudgeService} from "../../../../service/adv-judge/adv-judge.service";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {ExcelExporterComponent} from "../../../share/excel-exporter/excel-exporter.component";
import {SalesService} from "../../../../service/sales/sales.service";
import {NgxSpinnerService} from "ngx-spinner";

/**
 * 결제내역 목록
 */
@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;
  @ViewChild('excelExporter') excelExporter: ExcelExporterComponent;

  search : any = {};
  grid : any = {};
  excel: any = {};
  selectLists : any = {};

  routeParams: any = {
    searchValue: '',
    searchType : ''
  };

  constructor(protected router: Router,
              protected salesService : SalesService,
              private advJudgeService: AdvJudgeService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService,
              private route: ActivatedRoute) {
    super();

    this.route.queryParams.subscribe((params) => {
      this.routeParams.searchType  = params.searchType  || '';
      this.routeParams.searchValue = params.searchValue || ' ';
    });

    this.salesService.searchPaymentHistoryCodes().subscribe(res => {
      let statusList = res.channelTypeCode.map(item => {
        return {name: item.name, value: item.code};
      });
      
      this.init(statusList);
    });
  }

  ngOnInit(): void {
  }

  private init(statusList: Array<any>) : void {
    this.grid = {
      api: SalesService.URL.SEARCH_PAYMENT_HISTORY_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '결제일시', field: 'regDate', width: 200 },
        { headerName: '결제구분', field: 'pgPaymentTypeName', width: 100 },
        { headerName: '고객 이메일', field: 'buyerEmail', width: 200 },
        { headerName: '광고채널', field: 'channelTypeName', width: 100 },
        { headerName: '결제상품', field: 'productName', width: 200 },
        { headerName: '광고이름', field: 'advName', width: 200 },
        { headerName: '광고 시작일', field: 'advStartDate', width: 150 },
        { headerName: '광고 종료일', field: 'advEndDate', width: 150 },
        { headerName: '결제금액', field: 'price', width: 150 },
        { headerName: '결제취소', field:'seq', width: 150,
          cellRenderer: "buttonRenderer"
          ,valueGetter: (params) => this.displayCancelLabel(params)
          ,cellRendererParams: {
            onClick: this.cancelPayment.bind(this)
          }
        }
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: '엑셀 다운로드',
          clickEventHandler: this.excelDownload.bind(this)
        }
      ];
    }

    this.selectLists = {
      advStatus: statusList,
      paymentType: [
        { name: '결제', value: false },
        { name: '취소', value: true }
      ],
      searchType: [
        { name: '광고처', value: 'mallName' },
        { name: '광고 이름', value: 'advName' },
        { name: '광고주', value: 'ownerName' },
        { name: '고객 이메일', value: 'buyerEmail' }
      ],
      periodType: [
        { name: '광고 시작일', value: 'searchAdvSt' },
        { name: '광고 종료일', value: 'searchAdvEn' }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "광고채널", nameWidth: '150', inputType: SearchInputType.select, id: 'channelType',
          options: this.selectLists.advStatus, selectedValue: '', width: 150, class: '' },
        { displayName: "결제 구분", nameWidth: '150', inputType: SearchInputType.select, id: 'paymentType',
          options: this.selectLists.paymentType, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: this.routeParams.searchType, width: 500, class: '', placeHolder: '', selTextValue: this.routeParams.searchValue, selectId: 'searchType', inputId: 'searchValue'},
        { displayName: "기간검색", nameWidth: '150', inputType: SearchInputType.selDateRangeRadio, id: 'periodType', searchCondComo: true,
          options: this.selectLists.periodType, selectedValue: '', width: 1000, class: '', placeHolder:' ',
          group: moment().milliseconds(),
          dateRangeRadioOptions: [
            {value: '-1,M', label: '1개월 전'},
            {value: '-7,d', label: '7일 전', checked: true},
            {value:  '0,d', label: '오늘'}
          ]}
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

        this.searchPaymentHistory(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.excel = {
      fileName : '결제내역',
      sheetName: '결제내역',
      headerNames: [],
      columnNames: [],
      columnWidths: [],
      buttonStyleClass: 'btn btn-type-03 sm-btn mr5',
      list: [],
      hide: true
    };

    this.grid.columnDefs.forEach((column) => {
      if (column.useExcelField) {
        this.excel.headerNames.push(column.headerName);
        this.excel.columnNames.push(column.field);
        this.excel.columnWidths.push(column.width / 10);
      }
    });

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 최종결제상태 '결제완료' 일시의 결제취소 버튼라벨
   *
   * @param params
   */
  displayCancelLabel(params) {
    return ('PGT002' == params.data.lastPaymentType && this.possibleModify()) ? '취소' : '';
  }


  /**
   * 결제내역 목록 조회
   *
   * @param params
   * @private
   */
  private searchPaymentHistory(params) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 결제 취소
   *
   * @param params
   * @private
   */
  private cancelPayment(params) : void {
    let rowData = params.rowData;
    if (rowData.pgPaymentType == 0) {
      this.confirmService.confirm('결제를 취소하시겠습니까?').afterClosed().subscribe((confirmYn) => {
        if (confirmYn == "Y") {
          this.salesService.cancelPayment(rowData.paymentSeq, rowData.advSeq).subscribe((res) => {
            if ('000' == res.body?.code) {
              if ('00' == res.body.data.resultCode) {
                this.confirmService.alert("취소가 완료되었습니다.");
                this.refresh();
              } else {
                this.confirmService.alert(res.body.data.resultMsg);
              }
            }
          });
        }
      });
    } else {
      this.confirmService.alert("이미 취소된 결제내역입니다.");
    }
  }

  /**
   * 엑셀 다운로드
   */
  public excelDownload(): void {
    this.salesService.searchPaymentListCount(this.search.params).subscribe((res) => {
      if (0 == res) {
        this.confirmService.alert('다운로드 가능 데이타가 없습니다.');
      } else if (10000 < res) {
        this.confirmService.alert([
            '최대 1만건까지 다운로드 가능합니다.',
            '<br>',
            '(', '현재요청건수: ', res, '건)'].join(''));
      } else {
        this.spinnerService.show('full');

        let params: any = JSON.parse(JSON.stringify(this.search.params));
        params.pageNo = 1;
        params.pageSize = 10000;

        this.salesService.searchPaymentList(params).subscribe((res) => {
          this.excel.list = res.data;

          this.spinnerService.hide('full');

          setTimeout(() => {
            this.excelExporter.download();
          });
        });
      }
    });
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh(): void {
    this.searchPaymentHistory(this.search.params);
  }
}
