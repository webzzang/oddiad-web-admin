import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CommonComponent} from "../../common-component";
import {EnvironmentService} from "../../../service/environment/environment.service";
import {AgGridComponent} from "../../../shared/component/ag-grid/ag-grid.component";
import {SearchboxComponent} from "../../../shared/component/searchbox/searchbox.component";
import {SearchInputType} from "../../../shared/component/searchbox";
import * as moment from "moment/moment";

/**
 * 기기 상세
 */
@Component({
  selector: 'app-environment-mng',
  templateUrl: './environment-mng.component.html',
  styleUrls: ['./environment-mng.component.scss']
})
export class EnvironmentMngComponent extends CommonComponent implements OnInit {

  @ViewChild('mngDataGrid')  mngDataGrid : AgGridComponent;
  @ViewChild('mngSearchBox') mngSearchBox: SearchboxComponent;

  @Output('moveListEvent') moveListEventEmitter: EventEmitter<string> = new EventEmitter();

  selectLists: any = {
  };

  deviceId: string;
  environment: any = {};

  search: any = {};
  grid: any = {};

  constructor(private environmentService: EnvironmentService) {
    super();

    this.environmentService.searchCodes().subscribe((res) => {
      let deviceStateCode: Array<any> = res.deviceStateCode.map((item) => {
        return { name: item.name, value: item.val };
      });

      let deviceLevelCode: Array<any> = res.deviceLevelCode.map((item) => {
        return { name: item.name, value: item.code };
      });

      this.initList(deviceStateCode, deviceLevelCode);
    });
  }

  ngOnInit() : void {
  }

  /**
   * 기기 목록 메뉴로 이동
   */
  moveEnvironmentList(refreshYn: string) : void {
    this.moveListEventEmitter.emit(refreshYn);
  }

  /**
   * 상태목록 조회 관련 코드 초기화
   *
   * @param deviceStateCode
   * @param deviceLevelCode
   */
  initList(deviceStateCode, deviceLevelCode): void {
    this.selectLists = {
      deviceStateCode: deviceStateCode,
      deviceLevelCode: deviceLevelCode,
      periodType: [
        { name: '동작일시', value: 'searchReg' }
      ]
    }

    this.search = {
      params: {},
      info: [
        { displayName: "동작구분", nameWidth: '150', inputType: SearchInputType.select, id: 'deviceState',
          options: this.selectLists.deviceStateCode, selectedValue: '', width: 150, class: '' },
        { displayName: "기기상태", nameWidth: '150', inputType: SearchInputType.select, id: 'deviceLevel',
          options: this.selectLists.deviceLevelCode, selectedValue: '', width: 150, class: '' },
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
        this.search.params.deviceId = this.deviceId;

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

        this.searchHistoryList();
      },
      clearBtnHandler: () : void => {
        this.mngSearchBox.onSearchBtnClick({ deviceId: this.deviceId });
      }
    };

    this.grid = {
      api: EnvironmentService.URL.SEARCH_HISTORY_LIST,
      isInitLoad: false,
      rowClassRules: {},
      columnDefs: [
        { headerName: '동작일시', field: 'regDate', width: 150 },
        { headerName: '동작코드', field: 'deviceState', width: 150 },
        { headerName: '동작구분', field: 'deviceStateName', width: 150 },
        { headerName: '기기상태', field: 'deviceLevelName', width: 150 }
      ]
    };
  }

  /**
   * 기기상태이력 목록 조회
   */
  searchHistoryList(): void {
    this.mngDataGrid.getList(this.search.params);
  }

  /**
   * 기기 아이디 변경
   *  - 외부 컴포넌트 조작용
   *
   * @param deviceId
   */
  public init(deviceId: string) : void {
    this.deviceId = deviceId;
    this.environment = {};

    if (this.deviceId) {
      this.environmentService.search(this.deviceId).subscribe((res) => {
        this.environment = res;
      });

      this.mngSearchBox.onSearchBtnClick({ deviceId: this.deviceId });
    }
  }
}
