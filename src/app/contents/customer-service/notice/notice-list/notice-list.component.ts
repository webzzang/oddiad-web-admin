import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import {CommonComponent} from "../../../common-component";
import {NoticeService} from "../../../../service/notice/notice.service";
import * as moment from "moment/moment";

/**
 * 공지사항 목록
 */
@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss']
})
export class NoticeListComponent extends CommonComponent implements OnInit {

  @ViewChild('dataGrid')  dataGrid : AgGridComponent;
  @ViewChild('searchBox') searchBox: SearchboxComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search: any = {};
  grid: any = {};
  selectLists: any = {
    expoCode: [],
    searchType: []
  }

  constructor(protected noticeService: NoticeService) {
    super();

    this.noticeService.searchCodes().subscribe((res) => {
      let expoCode: Array<any> = res.expoCode.map((item) => {
        return {name: item.name, value: item.val};
      });

      this.init(expoCode);
    });
  }

  ngOnInit(): void {
  }

  private init(expoCode: Array<any>) : void {
    this.selectLists = {
      expoCode: expoCode,
      searchType: [
        { name: '제목', value: 'title' },
        { name: '등록자 이메일', value: 'regId' }
      ],
      periodType: [
        { name: '등록일', value: 'searchReg' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "전시 상태", nameWidth: '150', inputType: SearchInputType.select, id: 'expo',
          options: this.selectLists.expoCode, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: '', width: 500, class: '', placeHolder: '', selTextValue: ' ', selectId: 'searchType', inputId: 'searchValue'},
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
        
        this.searchNoticeList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: NoticeService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '전시', field: 'expoCodeName', width: 150 },
        { headerName: '제목', field: 'title', width: 200,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveNoticeMng.bind(this)
          }
        },
        { headerName: '등록자', field: 'regEmail', width: 150 },
        { headerName: '등록 일시', field: 'regDate', width: 150 }
      ]
    };

    if (this.possibleRegister(true)) {
      this.grid.funcButtons = [
        {
          label: '공지사항 등록',
            clickEventHandler: this.moveNoticeMng.bind(this)
        }
      ]
    }

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 공지사항목록 조회
   *
   * @param params
   * @private
   */
  private searchNoticeList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 공지사항관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveNoticeMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchNoticeList(this.search.params);
  }
}
