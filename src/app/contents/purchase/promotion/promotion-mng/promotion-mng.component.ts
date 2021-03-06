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
   * ???????????? ?????? ?????? ?????? ?????????
   *
   * @param couponUsableCode
   */
  initList(couponUsableCode: Array<any>): void {
    this.selectLists = {
      couponUsableCode: couponUsableCode,
      searchType: [
        { name: '?????? ??????'  , value: 'couponCode' },
        { name: '?????? ?????????', value: 'email' }
      ],
      periodType: [
        { name: '????????????', value: 'searchUsing' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "??????", nameWidth: '150', inputType: SearchInputType.select, id: 'usable',
          options: this.selectLists.couponUsableCode, selectedValue: '', width: 150, class: '' },
        { displayName: "?????????", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'},
        { displayName: "????????????", nameWidth: '150', inputType: SearchInputType.selDateRangeRadio, id: 'periodType', searchCondComo: true,
          options: this.selectLists.periodType, selectedValue: '', width: 1000, class: '', placeHolder:' ',
          group: moment().milliseconds(),
          dateRangeRadioOptions: [
            {value: '-1,M', label: '1?????? ???'},
            {value: '-7,d', label: '7??? ???', checked: true},
            {value:  '0,d', label: '??????'}
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
        { headerName: '????????????', field: 'couponCode', width: 350, sortable: true, useSort: false, useExcelField: true },
        { headerName: '????????????', field: 'regDate', width: 200, sortable: true, useSort: false, useExcelField: true },
        { headerName: '????????????', field: 'usableName', width: 100, sortable: true, useSort: false, useExcelField: true },
        { headerName: '?????? ?????????', field: 'email', width: 200, sortable: true, useSort: false, useExcelField: true },
        { headerName: '????????????', field: 'usingDate', width: 200, sortable: true, useSort: false, useExcelField: true }
      ]
    };

    this.grid.funcButtons = [
      {
        label: '?????? ????????????',
        clickEventHandler: this.excelDownload.bind(this)
      }
    ];

    this.excel = {
      fileName : '',
      sheetName: '??????????????????',
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
   * ?????? ?????? ??????
   */
  searchCouponList(): void {
    this.mngDataGrid.getList(this.search.params);
  }

  /**
   * ???????????? ?????? ?????? or ??????
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
        this.confirmService.alert('?????????????????????.');
      } else {
        this.confirmService.alert(res.message);
      }
    });
  }

  /**
   * ?????? ??????
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
   * ?????? ????????????
   */
  public excelDownload(): void {
    this.purchaseService.searchPromotionCouponCount(this.search.params).subscribe((res) => {
      if (0 == res) {
        this.confirmService.alert('???????????? ?????? ???????????? ????????????.');
      } else if (10000 < res) {
        this.confirmService.alert([
          '?????? 1???????????? ???????????? ???????????????.',
          '<br>',
          '(', '??????????????????: ', res, '???)'].join(''));
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
   * ???????????? ?????? ????????? ??????
   */
  movePromotionList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * ???????????? ????????? ??????
   *  - ?????? ???????????? ?????????
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
        
        this.excel.fileName = [this.promotion.name, '??????????????????'].join(' ');
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
