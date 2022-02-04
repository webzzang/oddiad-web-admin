import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import {CommonComponent} from "../../../common-component";
import {BundlePurchaseService} from "../../../../service/purchase-bundle/bundle-purchase.service";
import * as moment from "moment/moment";

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent extends CommonComponent implements OnInit {
  
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;
  @ViewChild('searchBox') searchBox: SearchboxComponent;

  @Output('movePromotionMngEvent') movePromotionMngEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output('moveSignupcouponMngEvent') moveSignupcouponMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search: any = {};
  grid: any = {};
  selectLists: any = {
  }

  constructor(private purchaseService: BundlePurchaseService) {
    super();

    this.init();
  }

  ngOnInit(): void {
  }

  private init() : void {
    this.selectLists = {
      periodType: [
        { name: '쿠폰 발행일시', value: 'searchReg' },
        { name: '프로모션 종료일', value: 'searchExpired' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "프로모션 이름", nameWidth: '150', inputType: SearchInputType.text, id: 'name', width: 150, class: '', placeHolder: '' },
        { displayName: "기간검색", nameWidth: '150', inputType: SearchInputType.selDateRangeRadio, id: 'periodType', searchCondComo: true,
          options: this.selectLists.periodType, selectedValue: '', width: 1000, class: '', placeHolder:' ',
          group: moment().milliseconds(),
          dateRangeRadioOptions: [
            {value: '-1,M', label: '1개월 전'},
            {value: '-7,d', label: '7일 전', checked: true},
            {value: '0,d', label: '오늘'},
            {value: '7,d', label: '7일 후'},
            {value: '1,M', label: '1개월 후'}
          ]
        }
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

        this.searchPromotionList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    let funcButtons: Array<any> = [];
    this.grid = {
      api: BundlePurchaseService.URL.SEARCH_PROMOTION_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '프로모션 이름', field: 'name', width: 200,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.movePromotionMng.bind(this)
          }
        },
        { headerName: '할인금액', field: 'discountPrice', width: 150 },
        { headerName: '쿠폰매수', field: 'couponCount', width: 150 },
        { headerName: '쿠폰 발행일시', field: 'regDate', width: 150 },
        { headerName: '프로모션 종료일', field: 'expiredDate', width: 150 }
      ]
    };

    if (this.possibleModify()) {
      funcButtons.push({
        label: '가입자 쿠폰 관리',
        clickEventHandler: this.moveSignupcoupomMng.bind(this)
      });
    }

    if (this.possibleRegister()) {
      funcButtons.push({
        label: '프로모션 등록',
        clickEventHandler: this.movePromotionMng.bind(this)
      });
    }

    this.grid.funcButtons = funcButtons;

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 프로모션 목록 조회
   *
   * @param params
   * @private
   */
  private searchPromotionList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 프로모션 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private movePromotionMng(event) : void {
    this.movePromotionMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 가입자쿠폰관리 페이지로 이동
   *
   * @private
   */
  private moveSignupcoupomMng() : void {
    this.moveSignupcouponMngEventEmitter.emit();
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchPromotionList(this.search.params);
  }
}
