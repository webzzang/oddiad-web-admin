import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SearchboxComponent} from "../../../../shared/component/searchbox/searchbox.component";
import {AgGridComponent} from "../../../../shared/component/ag-grid/ag-grid.component";
import {SearchInputType} from "../../../../shared/component/searchbox";
import {CommonComponent} from "../../../common-component";
import {AdvPlanService} from "../../../../service/adv-plan/adv-plan.service";

/**
 * 광고편성 목록
 */
@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent extends CommonComponent implements OnInit {

  @ViewChild('searchBox') searchBox: SearchboxComponent;
  @ViewChild('dataGrid')  dataGrid : AgGridComponent;

  @Output('moveMngEvent') moveMngEventEmitter: EventEmitter<string> = new EventEmitter();

  search : any = {};
  grid : any = {};
  selectLists : any = {
    advChannelCode: []
  };

  constructor(private advPlanService: AdvPlanService) {
    super();

    this.advPlanService.searchCodes().subscribe(res => {
      let advChannelCode = res.advChannelCode.map(item => {
        return {name: item.name, value: item.code};
      });

      this.init(advChannelCode);
    });
  }

  ngOnInit() : void {
  }

  private init(advChannelCode) : void {
    this.selectLists = {
      advChannelCode: advChannelCode,
      searchType: [
        { name: '광고처 이름', value: 'mallName' },
        { name: '기기 이름', value: 'deviceName' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "광고 채널", nameWidth: '150', inputType: SearchInputType.select, id: 'channelType',
          options: this.selectLists.advChannelCode, selectedValue: '', width: 150, class: '' },
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

        ['searchType', 'searchValue'].forEach((name) => {
          delete this.search.params[name];
        });

        this.searchPlanList(this.search.params);
      },
      clearBtnHandler: () : void => {
        this.searchBox.onSearchBtnClick(null);
      }
    };

    this.grid = {
      api: AdvPlanService.URL.SEARCH_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '광고처 이름', field: 'mallName', width: 200,
          cellRenderer: "buttonRenderer",
          cellRendererParams: {
            onClick: this.movePlanMng.bind(this)
          }},
        { headerName: '광고 채널', field: 'channelTypeName', width: 100 },
        { headerName: '기기 이름', field: 'deviceName', width: 200 },
        { headerName: '운영 광고 수', field: 'advCount', width: 100 },
        { headerName: '화면 분할', field: 'displayDivName', width: 100 },
        { headerName: '최종 업데이트', field: 'regDate', width: 150 }
      ]
    };

    setTimeout(() => {
      this.searchBox.onSearchBtnClick(null);
    });
  }

  /**
   * 광고편성 목록 조회
   *
   * @param params 조회조건
   * @private
   */
  private searchPlanList(params: any) : void {
    this.dataGrid.getList(params);
  }

  /**
   * 광고편성 관리 페이지로 이동
   *
   * @param event
   * @private
   */
  private movePlanMng(event) : void {
    let data: any = {
      seq: event?.rowData?.seq,
      deviceId: event?.rowData?.deviceId || 'null'
    };

    this.moveMngEventEmitter.emit(data);
  }

  /**
   * 페이지 갱신
   *  - 외부 컴포넌트 조작용
   */
  public refresh() : void {
    this.searchPlanList(this.search.params);
  }
}
