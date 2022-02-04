import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import * as moment from "moment/moment";
import {CommonComponent} from "../../../common-component";
import {AdvJudgeService} from "../../../../service/adv-judge/adv-judge.service";
import {ActivatedRoute} from "@angular/router";

/**
 * 광고심사 목록
 */
@Component({
  selector: 'app-judge-list',
  templateUrl: './judge-list.component.html',
  styleUrls: ['./judge-list.component.scss']
})
export class JudgeListComponent extends CommonComponent implements OnInit {
  
  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists : any = {
    advChannelCode: [],
    progressCode: [],
    auditCode: []
  };

  routeParams: any = {
    searchValue: '',
    searchType : ''
  };

  constructor(private advJudgeService: AdvJudgeService,
              private route: ActivatedRoute) {
    super();

    this.route.queryParams.subscribe((params) => {
      this.routeParams.searchType  = params.searchType  || '';
      this.routeParams.searchValue = params.searchValue || ' ';
    });

    this.advJudgeService.searchCodes().subscribe(res => {
      let advChannelCode = res.advChannelCode.map(item => {
        return {name: item.name, value: item.code};
      });

      let progressCode = res.progressCode.map(item => {
        return {name: item.name, value: item.code};
      });

      let auditCode = res.auditCode.map(item => {
        return {name: item.name, value: item.code};
      });

      this.init(advChannelCode, progressCode, auditCode);
    });
  }

  ngOnInit() : void {
  }

  private init(advChannelCode: Array<any>, progressCode: Array<any>, auditCode: Array<any>) : void {
    this.selectLists = {
      advChannelCode: advChannelCode,
      progressCode  : progressCode,
      auditCode     : auditCode,
      searchType: [
        { name: '광고 이름', value: 'title' },
        { name: '고객 이름', value: 'name' },
        { name: '고객 이메일', value: 'email' }
      ],
      periodType: [
        { name: '신청일', value: 'searchReg' },
        { name: '광고 시작일', value: 'searchSt' },
        { name: '광고 종료일', value: 'searchEn' }
      ]
    };

    this.search = {
      params: {},
      info: [
        { displayName: "광고 채널", nameWidth: '150', inputType: SearchInputType.select, id: 'channelType',
          options: this.selectLists.advChannelCode, selectedValue: '', width: 150, class: '' },
        { displayName: "결제 상태", nameWidth: '150', inputType: SearchInputType.select, id: 'progressCode',
          options: this.selectLists.progressCode, selectedValue: '', width: 150, class: '' },
        { displayName: "심사 상태", nameWidth: '150', inputType: SearchInputType.select, id: 'auditCode',
          options: this.selectLists.auditCode, selectedValue: '', width: 150, class: '' },
        { displayName: "검색어", nameWidth: '150', inputType: SearchInputType.selText, id: 'searchType', searchCondComo: true,
          options: this.selectLists.searchType, selectedValue: this.routeParams.searchType, width: 500, class: '', placeHolder: '', selTextValue: this.routeParams.searchValue, selectId: 'searchType', inputId: 'searchValue'},
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

        this.searchJudgeList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: AdvJudgeService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '고객 이메일', field: 'email', width: 200 },
        { headerName: '고객 이름', field: 'name', width: 100 },
        { headerName: '광고 이름', field: 'title', width: 200,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.moveJudgeMng.bind(this)
          }
        },
        { headerName: '광고 채널', field: 'channelTypeName', width: 100 },
        { headerName: '타입', field: 'designTypeName', width: 100 },
        { headerName: '광고 시작일', field: 'startDate', width: 150 },
        { headerName: '광고 종료일', field: 'endDate', width: 150 },
        { headerName: '신청 일시', field: 'regDate', width: 150 },
        { headerName: '결제 상태', field: 'progressCodeName', width: 150 },
        { headerName: '심사 상태', field: 'auditCodeName', width: 100 }
      ]
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 광고심사 목록 조회
   *
   * @param params 조회조건
   * @private
   */
  private searchJudgeList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 광고심사 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private moveJudgeMng(event) : void {
    this.moveMngEventEmitter.emit(event?.rowData?.seq);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchJudgeList(this.search.params);
  }
}
