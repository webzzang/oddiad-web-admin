import {Component, OnInit, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment";
import {ActivatedRoute} from "@angular/router";
import {CommonComponent} from "../../../common-component";
import {SalesService} from "../../../../service/sales/sales.service";

/**
 * 광고내역 목록
 */
@Component({
  selector: 'app-advhistory-list',
  templateUrl: './advhistory-list.component.html',
  styleUrls: ['./advhistory-list.component.scss']
})
export class AdvhistoryListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  search : any = {};
  grid : any = {};
  selectLists : any = {};

  routeParams: any = {
    searchValue: '',
    searchType : ''
  };

  constructor(private salesService : SalesService,
              private route: ActivatedRoute) {

    super();

    this.route.queryParams.subscribe((params) => {
      this.routeParams.searchType  = params.searchType  || '';
      this.routeParams.searchValue = params.searchValue || ' ';
    });

    this.salesService.searchAdvHistoryCodes().subscribe(res => {
      let statusList = res.channelTypeCode.map(item => {
        return {name: item.name, value: item.code};
      });

      this.init(statusList);
    })
  }

  ngOnInit(): void {
  }

  private init(statusList: Array<any>) : void {
    this.grid = {
      api: SalesService.URL.SEARCH_ADV_HISTORY_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '광고 채널', field: 'channelTypeName', width: 150 },
        { headerName: '광고처', field: 'mallName', width: 150 },
        { headerName: '광고 기기', field: 'deviceName', width: 150 },
        { headerName: '광고 이름', field: 'advName', width: 150 },
        { headerName: '고객 이메일', field: 'email', width: 150 },
        { headerName: '광고주', field: 'ownerName', width: 150 },
        { headerName: '광고 시작일', field: 'advStartDate', width: 150 },
        { headerName: '광고 종료일', field: 'advEndDate', width: 150 }
      ]
    };


    this.selectLists = {
      advStatus: statusList,
      searchType: [
        { name: '광고처', value: 'mallName' },
        { name: '광고 이름', value: 'advName' },
        { name: '광고주', value: 'ownerName' },
        { name: '고객 이메일', value: 'email' }
      ],
      periodType: [
        { name: '광고 시작일', value: 'searchAdvSt' },
        { name: '광고 종료일', value: 'searchAdvEn' }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "상태", nameWidth: '150', inputType: SearchInputType.select, id: 'channelType',
          options: this.selectLists.advStatus, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: this.routeParams.searchType, width: 310, class: '', placeHolder: '', selTextValue: this.routeParams.searchValue, selectId: 'searchType', inputId: 'searchValue'},
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

        this.searchAdvHistory(this.search.params);

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
   * 광고내역 조회
   *
   * @param params 조회조건
   * @private
   */
  private searchAdvHistory(params) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchAdvHistory(this.search.params);
  }
}
