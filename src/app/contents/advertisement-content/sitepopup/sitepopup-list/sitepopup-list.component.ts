import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {ContentService} from "../../../../service/content/content.service";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {CommonComponent} from "../../../common-component";

/**
 * 사이트 팝업 목록
 */
@Component({
  selector: 'app-sitepopup-list',
  templateUrl: './sitepopup-list.component.html',
  styleUrls: ['./sitepopup-list.component.scss']
})
export class SitepopupListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists : any = {};

  constructor() {
    super();

    this.init();
  }

  ngOnInit(): void {
  }

  private init() : void {
    this.grid = {
      api: ContentService.URL.SEARCH_SITE_POPUP_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '팝업 이름', field: 'name', width: 150, sortable: false, useSort: false,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveSitePopupMng.bind(this)
          }
        },
        { headerName: '노출 시작일', field: 'expoStartDate', width: 150, sortable: false, useSort: false },
        { headerName: '노출 종료일', field: 'expoEndDate', width: 150, sortable: false, useSort: false },
        { headerName: '등록 일시'  , field: 'regDate', width: 150, sortable: true, useSort: false },
        { headerName: '수정 일시'  , field: 'modDate', width: 150, sortable: true, useSort: false },
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: '팝업 등록',
          clickEventHandler: this.moveSitePopupMng.bind(this)
        }
      ];
    }

    this.selectLists = {
      periodType: [
        { name: '노출 시작일', value: 'searchStExpo' },
        { name: '노출 종료일', value: 'searchEnExpo' },
        { name: '등록일'    , value: 'searchReg' }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "팝업 이름", nameWidth: '150', inputType: SearchInputType.text, id: 'bannerName', width: 150, class: '', placeHolder: '' },
        { displayName: "기간검색", nameWidth: '150', inputType: SearchInputType.selDateRangeRadio, id: 'periodType', searchCondComo: true,
          options: this.selectLists.periodType, selectedValue: '', width: 1000, class: '', placeHolder:' ',
          group: moment().milliseconds(),
          dateRangeRadioOptions: [
            {value: '-1,M', label: '1개월 전'},
            {value: '-7,d', label: '7일 전', checked: true},
            {value:  '0,d', label: '오늘'},
            {value:  '7,d', label: '7일 후'},
            {value:  '1,M', label: '1개월 후'}
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

        this.searchSitePopupList(this.search.params);
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
   * 팝업 목록 조회
   * 
   * @param params
   * @private
   */
  private searchSitePopupList(params?: any): void {
    return this.dataGrid.getList(params);
  }

  /**
   * 팝업 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveSitePopupMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchSitePopupList();
  }
}
