import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CommonComponent} from "../../../common-component";
import {BundlePurchaseService} from "../../../../service/purchase-bundle/bundle-purchase.service";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {CustomLocale} from "flatpickr/dist/types/locale";
import {Korean} from "flatpickr/dist/l10n/ko";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {Observable} from "rxjs";
import {ConfirmService} from "../../../../shared/component/confirm/confirm.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ExcelExporterComponent} from "../../../share/excel-exporter/excel-exporter.component";

@Component({
  selector: 'app-promotion-mng',
  templateUrl: './promotion-mng.component.html',
  styleUrls: ['./promotion-mng.component.scss']
})
export class PromotionMngComponent extends CommonComponent implements OnInit {

  @ViewChild('mngDataGrid')  mngDataGrid : AgGridComponent;
  @ViewChild('mngSearchBox') mngSearchBox: SearchboxComponent;
  @ViewChild('excelExporter') excelExporter: ExcelExporterComponent;

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
    couponUsableCode: []
  };

  seq: number;
  promotion: any = {};
  coupon   : any = {};
  couponIssueNumber: number;
  refreshListYn: string = 'N';

  search: any = {};
  grid: any = {};
  excel: any = {};

  datepickerLocal: CustomLocale = Korean;

  constructor(private purchaseService: BundlePurchaseService,
              private confirmService: ConfirmService,
              private spinnerService: NgxSpinnerService) {
    super();

    this.purchaseService.searchPromotionCodes().subscribe((res) => {
      let couponUsableCode: Array<any> = res.couponUsableCode.map((item) => {
        return { name: item.name, value: item.val == 1 };
      });

      this.initList(couponUsableCode);
    });
  }

  ngOnInit() : void {
  }

  /**
   * 상태목록 조회 관련 코드 초기화
   *
   * @param couponUsableCode
   */
  initList(couponUsableCode: Array<any>): void {
    this.selectLists = {
      couponUsableCode: couponUsableCode,
      searchType: [
        { name: '쿠폰 코드'  , value: 'couponCode' },
        { name: '고객 이메일', value: 'email' }
      ],
      periodType: [
        { name: '사용일시', value: 'searchUsing' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "상태", nameWidth: '150', inputType: SearchInputType.select, id: 'usable',
          options: this.selectLists.couponUsableCode, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'},
        { displayName: "기간검색", nameWidth: '150', inputType: SearchInputType.selDateRangeRadio, id: 'periodType', searchCondComo: true,
          options: this.selectLists.periodType, selectedValue: '', width: 1000, class: '', placeHolder:' ',
          group: moment().milliseconds(),
          dateRangeRadioOptions: [
            {value: '-1,M', label: '1개월 전'},
            {value: '-7,d', label: '7일 전', checked: true},
            {value:  '0,d', label: '오늘'}
          ]
        }
      ],
      searchBtnHandler: ($event) : void => {
        this.search.params = $event;
        this.search.params.seq = this.seq;

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

        this.searchCouponList();
      },
      clearBtnHandler: () : void => {
        this.mngSearchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: BundlePurchaseService.URL.SEARCH_COUPON_LIST,
      isInitLoad: false,
      defaultColDef: {
        cellStyle : {
          'text-align' : 'center'
        }
      },
      rowClassRules: {},
      columnDefs: [
        { headerName: 'No', field: 'rownum', width: 150, sortable: true, useSort: false, useExcelField: false },
        { headerName: '쿠폰코드', field: 'couponCode', width: 350, sortable: true, useSort: false, useExcelField: true },
        { headerName: '발행일시', field: 'regDate', width: 200, sortable: true, useSort: false, useExcelField: true },
        { headerName: '사용여부', field: 'usableName', width: 100, sortable: true, useSort: false, useExcelField: true },
        { headerName: '고객 이메일', field: 'email', width: 200, sortable: true, useSort: false, useExcelField: true },
        { headerName: '사용일시', field: 'usingDate', width: 200, sortable: true, useSort: false, useExcelField: true }
      ]
    };

    this.grid.funcButtons = [
      {
        label: '엑셀 다운로드',
        clickEventHandler: this.excelDownload.bind(this)
      }
    ];

    this.excel = {
      fileName : '',
      sheetName: '쿠폰발행내역',
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
  }

  /**
   * 쿠폰 목록 조회
   */
  searchCouponList(): void {
    this.mngDataGrid.getList(this.search.params);
  }

  /**
   * 프로모션 정보 등록 or 수정
   */
  savePromotion() : void {
    let ob: Observable<any>;

    if (!this.seq) {
      ob = this.purchaseService.registerPromotion(this.promotion);
    } else {
      ob = this.purchaseService.modifyPromotion(this.promotion);
    }
    
    ob.subscribe((res) => {
      if (!res.code) {
        if (!this.seq) {
          this.seq = res;
        }

        this.init(this.seq);
        this.confirmService.alert('저장되었습니다.');
      } else {
        this.confirmService.alert(res.message);
      }
    });
  }

  /**
   * 쿠폰 발급
   */
  issueCoupon(): void {
    let params: any = {
      seq: this.seq,
      contents : this.promotion.contents,
      couponCnt: this.couponIssueNumber,
      discountPrice: this.promotion.discountPrice,
      discountType: this.promotion.discountType,
      expiredDate: this.promotion.expiredDate,
      name: this.promotion.name
    };

    this.spinnerService.show('full');
    this.purchaseService.registerPromotionCoupon(params).subscribe((res) => {
      this.spinnerService.hide('full');

      if (!res.code) {
        this.refreshListYn = 'Y';
        this.init(this.seq);
      } else {
        this.confirmService.alert(res.message);
      }
    });
  }

  /**
   * 엑셀 다운로드
   */
  public excelDownload(): void {
    this.purchaseService.searchPromotionCouponCount(this.search.params).subscribe((res) => {
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

        this.purchaseService.searchPromotionCouponList(params).subscribe((res) => {
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
   * 프로모션 목록 메뉴로 이동
   */
  movePromotionList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 프로모션 시퀀스 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param seq
   */
  public init(seq: number) : void {
    this.seq = seq;
    this.promotion = {};

    if (this.seq) {
      this.purchaseService.searchPromotion(this.seq).subscribe((res) => {
        this.promotion = this.coupon = res;
        this.promotion.discountType = 'PDT001';
        this.promotion.expiredDateLabel = this.promotion.expiredDate;
        this.promotion.expiredDate = this.promotion.expiredDate?.replace(/-/g, '');
        
        this.excel.fileName = [this.promotion.name, '쿠폰발행내역'].join(' ');
      });

      setTimeout(() => {
        this.mngSearchBox.onSearchBtnClick(null);
      }, 300);
    } else {
      this.promotion = {
        discountType: 'PDT001'
      };
    }
  }
}
